const express = require("express");
const router = express.Router();
// --- FIX: Import the correct functions ---
const { 
  register, 
  verifyOtp, 
  login, 
  verifyLoginOtp // <-- Import this
} = require("../controllers/authcontroller");

router.post("/register", register);
router.post("/verify-otp", verifyOtp); // For registration

// --- FIX: Update login routes ---
router.post("/login", login); // Step 1: Checks password, sends SMS
router.post("/verify-login-otp", verifyLoginOtp); // Step 2: Verifies SMS OTP

module.exports = router;
