import React from "react";

function Portfolio() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark p-3">
        <span className="navbar-brand mb-0 h1">My Portfolio</span>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="container mt-4">
        <section className="mb-5">
          <h2>About Me</h2>
          <p>Hello, I’m Shreya — a passionate Full Stack Developer.</p>
        </section>

        <section className="mb-5">
          <h2>Skills</h2>
          <ul>
            <li>JavaScript / React.js / Node.js</li>
            <li>MongoDB / Express.js</li>
            <li>HTML / CSS / Bootstrap</li>
          </ul>
        </section>

        <section>
          <h2>Projects</h2>
          <p>💡 Login & Authentication System with React + Node.js + MongoDB</p>
        </section>
      </div>
    </div>
  );
}

export default Portfolio;
