import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Portfolio from "./pages/Portfolio";

function App() {
  const isAuthenticated = localStorage.getItem("token"); // check JWT from login

  return (
    <Router>
      <Routes>
        {/* Default route → Register */}
        <Route path="/" element={<Register />} />

        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Protected route → Only if logged in */}
        <Route
          path="/portfolio"
          element={isAuthenticated ? <Portfolio /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
