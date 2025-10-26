import './App.css';
import React, { useState, useEffect } from "react"; 
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Portfolio from "./pages/Portfolio";

function App() {
  // Manage authentication status with state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for token in localStorage when the app loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []); // The empty array ensures this runs only once on mount

  // This function will be passed down to both Login and Register
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        {/* Pass the handler function as a prop to Login */}
        <Route 
          path="/" 
          element={<Login onLoginSuccess={handleLoginSuccess} />} 
        />
        
        {/* Pass the same handler function as a prop to Register */}
        <Route 
          path="/register" 
          element={<Register onLoginSuccess={handleLoginSuccess} />} 
        />

        {/* This protected route will now work correctly from either flow */}
        <Route
          path="/portfolio"
          element={isAuthenticated ? <Portfolio /> : <Navigate to="/" />}
        />
        
        {/* Redirect authenticated users away from the login page */}
        {isAuthenticated && <Route path="/login" element={<Navigate to="/portfolio" />} />}
      </Routes>
    </Router>
  );
}

export default App;
