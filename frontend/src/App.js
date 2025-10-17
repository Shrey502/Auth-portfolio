import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Portfolio from "./pages/Portfolio";
// import Setup from "./pages/Setup";

function App() {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Default route → Register */}
        <Route path="/" element={<Login />} />

        {/* Login route */}
        <Route path="/register" element={<Register />} />

        Portfolio route (Protected)
        <Route
          path="/portfolio"
          element={isAuthenticated ? <Portfolio /> : <Navigate to="/login" />}
        />

        {/* Setup route (Protected) - THIS WAS MISSING */}
        {/* <Route
          path="/setup"
          element={isAuthenticated ? <Setup /> : <Navigate to="/login" />}
        /> */}
        
      </Routes>
    </Router>
  );
}

export default App;