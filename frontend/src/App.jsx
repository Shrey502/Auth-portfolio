// // src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Portfolio from './pages/Portfolio';
// import Setup from "./pages/Setup";

// function App() {
//   const token = localStorage.getItem('token');

//   return (
//     <Router>
//       <nav className="navbar navbar-light bg-light">
//         <div className="container">
//           <Link className="navbar-brand" to="/">AuthDemo</Link>
//           <div>
//             <Link className="btn btn-outline-primary me-2" to="/register">Register</Link>
//             <Link className="btn btn-primary" to="/login">Login</Link>
//           </div>
//         </div>
//       </nav>

//       <div className="container mt-4">
//         <Routes>
//           <Route path="/" element={<Navigate to="/login" />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/portfolio" element={token ? <Portfolio /> : <Navigate to="/login" />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
