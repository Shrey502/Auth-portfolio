import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
        // send login data to backend
        const res = await axios.post("http://localhost:5000/api/auth/login", {
            email,
            password,
        });

        // Destructure the response data for easier access
        const { token, user } = res.data;

        // store token and user info locally
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/portfolio");

        // **CORRECTED LOGIC**
        // Check the user object from the response
        // if (!user.bio) {
        //     navigate("/setup");
        // } else {
        //     navigate("/portfolio");
        // }
        // The redundant navigate call is removed.

    } catch (err) {
        console.error("Login error:", err);
        alert("Invalid email or password");
    } finally {
        setLoading(false); // Stop loading in any case
    }
};

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>

      <p className="text-center mt-3">
        Don’t have an account? <a href="/Register">Register here</a>
      </p>
    </div>
  );
};

export default Login;
