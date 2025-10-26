import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// This component should ONLY import React-related libraries and axios
const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false); // New state
  const navigate = useNavigate();

  // Define the base API URL from environment variables
  const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/auth`;

  // Step 1: Submit Email and Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      // We ONLY use axios to "talk" to the backend.
      // We do not import any backend code.
      await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      setIsPasswordVerified(true); // Move to OTP step
      alert("Password correct! An OTP has been sent to your registered mobile number.");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed.");
    }
  };

  // Step 2: Submit SMS OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use axios to send the email and OTP to the verification endpoint
      const res = await axios.post(`${API_URL}/verify-login-otp`, {
        email,
        otp,
      });

      // On success, get the token from the response
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      onLoginSuccess(); // Update parent App state
      navigate("/portfolio"); // Navigate to portfolio

    } catch (err) {
      alert(err.response?.data?.msg || "Invalid or expired OTP.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      {!isPasswordVerified ? (
        <>
          {/* --- STAGE 1: Email and Password --- */}
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label>Password</label>
              {/* --- THIS LINE IS NOW FIXED --- */}
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </>
      ) : (
        <>
          {/* --- STAGE 2: SMS OTP Verification --- */}
          <h2 className="text-center mb-4">Enter SMS OTP</h2>
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-3">
              <label>SMS Verification Code:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Verify & Login
            </button>
          </form>
        </>
      )}

      <p className="text-center mt-3">
        Don’t have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default Login;

