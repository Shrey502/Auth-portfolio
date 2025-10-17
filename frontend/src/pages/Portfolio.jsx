import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Portfolio = () => {
  const navigate = useNavigate();
  // Get the logged-in user's data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // Redirect to login page
  };

  // If for some reason user data isn't found, redirect to login
  if (!user) {
    navigate("/login");
    return null; // Render nothing while redirecting
  }

  return (
    <div>
      {/* Navbar with Logout button */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">
            Portfolio
          </span>
          <button
            className="btn btn-outline-light"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Simple Welcome Message */}
      <div className="container text-center mt-5">
        <h1>Hello, {user.name}</h1>
        <p className="lead">Welcome to your page.</p>
      </div>
    </div>
  );
};

export default Portfolio;