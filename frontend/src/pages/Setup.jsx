import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Setup = () => {
  const navigate = useNavigate();

  // FIX 1: Get user from localStorage ONLY ONCE and store it in state.
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user"));
  });

  // FIX 2: Initialize form data directly from the user state.
  const [formData, setFormData] = useState({
    heading: user?.heading || "",
    bio: user?.bio || "",
    projects: user?.projects?.length > 0 ? user.projects : [{ title: "", description: "", link: "" }],
  });
  
  const [loading, setLoading] = useState(false);

  // FIX 3: The useEffect hook is no longer needed for this, so it has been removed.

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProjectChange = (index, e) => {
    const updatedProjects = formData.projects.map((project, i) =>
      index === i ? { ...project, [e.target.name]: e.target.value } : project
    );
    setFormData({ ...formData, projects: updatedProjects });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { title: "", description: "", link: "" }],
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        config
      );

      // Update both localStorage AND the component's user state
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);

      navigate("/portfolio");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <h2>{user?.bio ? "Edit Your Profile" : "Setup Your Profile"}</h2>
      <p>Fill out the details below to create your portfolio.</p>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Headline</label>
          <input
            type="text"
            className="form-control"
            name="heading"
            value={formData.heading}
            onChange={onChange}
            placeholder="e.g., Full Stack Developer"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Your Bio</label>
          <textarea
            className="form-control"
            name="bio"
            value={formData.bio}
            onChange={onChange}
            rows="3"
            placeholder="Tell us a little about yourself"
          ></textarea>
        </div>
        <hr />
        <h4>Projects</h4>
        {formData.projects.map((project, index) => (
          <div key={index} className="p-3 mb-3 border rounded">
            <h5>Project {index + 1}</h5>
            <input
              type="text"
              name="title"
              className="form-control mb-2"
              placeholder="Project Title"
              value={project.title}
              onChange={(e) => handleProjectChange(index, e)}
            />
            <textarea
              name="description"
              className="form-control mb-2"
              placeholder="Project Description"
              value={project.description}
              onChange={(e) => handleProjectChange(index, e)}
            ></textarea>
            <input
              type="text"
              name="link"
              className="form-control"
              placeholder="Project Link (e.g., https://github.com/...)"
              value={project.link}
              onChange={(e) => handleProjectChange(index, e)}
            />
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={addProject}>
          + Add Another Project
        </button>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save and View Portfolio"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Setup;