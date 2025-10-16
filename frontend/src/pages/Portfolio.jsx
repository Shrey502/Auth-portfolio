import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap"; // Imports are now used

const Portfolio = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // State for the modal is now used
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Modal handler functions are now used
  const handleShowModal = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

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
            <span className="navbar-brand">{user ? `${user.name}'s Portfolio` : "My Portfolio"}</span>
            <div>
              <button className="btn btn-outline-info me-2" onClick={() => navigate("/setup")}>
                Edit Profile
              </button>
              <button className="btn btn-outline-light" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center p-5 bg-light rounded-4 shadow-sm">
          <h1>{user?.heading || "Welcome to Your Portfolio!"}</h1>
          <p className="lead mt-3">{user?.bio || "Please set up your profile to see your bio here."}</p>
        </div>

        {/* Projects Section - Mapped dynamically */}
        <section id="projects" className="mt-5">
          <h2 className="text-center mb-4">My Projects</h2>
          <div className="row">
            {user?.projects && user.projects.length > 0 ? (
              user.projects.map((project, idx) => (
                <div className="col-md-4 mb-4" key={idx}>
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <div>
                        <h5 className="card-title">{project.title}</h5>
                        <p className="card-text">{project.description.substring(0, 100)}...</p>
                      </div>
                      <button
                        className="btn btn-outline-primary btn-sm mt-2"
                        onClick={() => handleShowModal(project)} // This uses the handler
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No projects added yet. Click "Edit Profile" to add some!</p>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-5 mb-3 text-muted">
          © {new Date().getFullYear()} {user ? user.name : "Your Name"} | All Rights Reserved
        </footer>
      </div>

      {/* Modal JSX - This uses the modal state and variables */}
      {selectedProject && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProject.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{selectedProject.description}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            {selectedProject.link && (
               <Button variant="primary" href={selectedProject.link} target="_blank" rel="noopener noreferrer">
                 View Project
               </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Portfolio;