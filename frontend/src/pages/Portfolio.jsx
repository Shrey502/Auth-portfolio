import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap"; // This import will now work

const Portfolio = () => {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // State to manage the modal
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      title: "Project One",
      text: "A web app built with React and Node.js that solves real-world problems. This project features a full authentication system and a dynamic user dashboard.",
      link: "https://github.com", // Use a real link or "#" if none
    },
    {
      title: "Project Two",
      text: "A portfolio management dashboard using MongoDB and Express. Users can add, edit, and delete projects, and the data is persisted in a NoSQL database.",
      link: "https://github.com",
    },
    {
      title: "Project Three",
      text: "A responsive Bootstrap website showcasing creative skills. This project focuses on a mobile-first design approach with clean UI/UX principles.",
      link: "https://github.com",
    },
  ];

  // Functions to handle modal display
  const handleShowModal = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      <div className="container mt-5">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded-3 mb-4">
          <div className="container-fluid">
            <span className="navbar-brand">
              {user ? `${user.name}'s Portfolio` : "My Portfolio"}
            </span>
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center p-5 bg-light rounded-4 shadow-sm">
          <h1>
            Hello, I’m{" "}
            <span className="text-primary fw-bold">
              {user ? user.name : "Guest"}
            </span>{" "}
            — a passionate Full Stack Developer.
          </h1>
          <p className="lead mt-3">
            I love building web applications using React, Node.js, and MongoDB.
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={() =>
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View My Work
          </button>
        </div>

        {/* Projects Section */}
        <section id="projects" className="mt-5">
          <h2 className="text-center mb-4">My Projects</h2>
          <div className="row">
            {projects.map((project, idx) => (
              <div className="col-md-4 mb-4" key={idx}>
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{project.title}</h5>
                      <p className="card-text">{project.text.substring(0, 70)}...</p>
                    </div>
                    <button
                      className="btn btn-outline-primary btn-sm mt-2"
                      onClick={() => handleShowModal(project)}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-5 mb-3 text-muted">
          © {new Date().getFullYear()} {user ? user.name : "Your Name"} | All
          Rights Reserved
        </footer>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProject.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{selectedProject.text}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" href={selectedProject.link} target="_blank">
              View Project
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Portfolio;