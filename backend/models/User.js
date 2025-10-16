// backend/models/User.js
const mongoose = require("mongoose");

// Define a simple schema for projects
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add these new fields
  heading: { type: String, default: "" },
  bio: { type: String, default: "" },
  projects: [projectSchema], // An array of projects
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);