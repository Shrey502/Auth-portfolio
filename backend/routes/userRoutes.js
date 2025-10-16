// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth"); // Import the middleware

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  try {
    const { heading, bio, projects } = req.body;

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Update fields
    user.heading = heading || user.heading;
    user.bio = bio || user.bio;
    user.projects = projects || user.projects;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;