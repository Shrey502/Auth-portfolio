import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Accepts onLoginSuccess prop from App.js to update auth state
function Register({ onLoginSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Added phone number field
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false); // Controls the UI state
  const navigate = useNavigate();
  
  // Define the base API URL
  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/auth`;

  // Step 1: Handle initial registration details submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send all details, including the new phone number
      await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        phoneNumber, // This field must be sent
      });
      setIsOtpSent(true); // Show the OTP field
      alert("OTP sent to your email! Please check and verify to complete registration.");
    } catch (err) {
      // Display specific backend error message if available
      alert(err.response?.data?.msg || "Registration failed. Please check your details.");
    }
  };

  // Step 2: Handle Email OTP verification and automatic login
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      // This endpoint now returns a token upon success
      const res = await axios.post(`${API_URL}/verify-otp`, {
        email,
        otp,
      });

      // --- Automatic Login Logic ---
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      onLoginSuccess(); // Update the parent App's state
      navigate("/portfolio"); // Redirect directly to the portfolio

    } catch (err) {
      alert(err.response?.data?.msg || "OTP verification failed.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Register</h2>
      {/* The form's onSubmit handler changes based on the UI state */}
      <form onSubmit={!isOtpSent ? handleRegisterSubmit : handleVerifyOtp}>
        <div className="mb-3">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isOtpSent} // Disable after OTP is sent
          />
        </div>
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isOtpSent} // Disable after OTP is sent
          />
        </div>
        <div className="mb-3">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isOtpSent} // Disable after OTP is sent
          />
        </div>

        {/* --- NEW PHONE FIELD --- */}
        <div className="mb-3">
          <label>Phone Number:</label>
          <input
            type="tel"
            className="form-control"
            placeholder="e.g., +919876543210 or +14155552671"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            disabled={isOtpSent}
          />
          <small className="form-text text-muted">Must include country code (e.g., +91, +1)</small>
        </div>
        {/* --- END NEW PHONE FIELD --- */}


        {/* Conditionally render the EMAIL OTP input field */}
        {isOtpSent && (
          <div className="mb-3">
            <label>Email Verification Code:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter 6-digit OTP from email"
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
        )}

        {/* Change button text based on the UI state */}
        <button type="submit" className="btn btn-success w-100">
          {!isOtpSent ? "Register & Send OTP" : "Verify & Complete Registration"}
        </button>
      </form>
      <p className="text-center mt-3">
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
}

export default Register;