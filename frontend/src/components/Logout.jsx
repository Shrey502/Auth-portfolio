// src/components/Logout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); //clear the token from local storage
    navigate("/login"); 
  };

  return (
    <button 
      className="btn btn-danger"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default Logout;
