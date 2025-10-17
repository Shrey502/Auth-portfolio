import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Attempt to register the new user
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      // If successful, show a success message and redirect to login
      alert("Registered successfully! Please log in.");
      navigate("/login");

    } catch (err) {
      // THE NEW LOGIC - Check for the specific error message from the backend
      if (err.response && err.response.data.msg === "User already exists") {
        
        // If the user exists, show the specific alert and redirect
        alert("User already exists. Redirecting to login page.");
        navigate("/");

      } else {
        // For any other error, show a generic message
        alert(err.response?.data?.msg || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Name:</label>
          <input type="text" className="form-control" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Email:</label>
          <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Password:</label>
          <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-success">Register</button>
      </form>
      <p className="text-center mt-3">Already have an account? <a href="/">Login</a></p>
    </div>
  );
}

export default Register;
