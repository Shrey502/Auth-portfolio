const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
require("dotenv").config();

// --- NEW: Import and configure Twilio ---
const twilio = require("twilio");
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Function to generate a random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// --- (HELPER) Function to send SMS ---
const sendSmsOtp = async (to, otp) => {
  try {
    await twilioClient.messages.create({
      body: `Your login OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to, // Must be in E.164 format, e.g., +1234567890
    });
    console.log("SMS OTP sent successfully.");
  } catch (err) {
    // Log the error but don't crash the server
    console.error("Twilio SMS Error:", err.message);
    // You might want to re-throw a specific error if sending SMS is critical
    // For now, we just log it. The login will fail later if user.save() was skipped.
  }
};

// --- UPDATED REGISTER FUNCTION ---
// Now accepts 'phoneNumber'
exports.register = async (req, res) => {
  try {
    // 1. Get all fields from body
    const { name, email, password, phoneNumber } = req.body;
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // 2. Check for existing user/phone
    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({ msg: "Email already exists" });
    }
    const phoneExists = await User.findOne({ phoneNumber });
    if (phoneExists) {
        return res.status(400).json({ msg: "Phone number already in use" });
    }

    // 3. Hash password, generate email OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    const emailOtp = generateOTP();

    if (user) {
      // User exists but isn't verified
      user.name = name;
      user.password = hashedPassword;
      user.phoneNumber = phoneNumber;
      user.otp = emailOtp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();
    } else {
      // Create new user
      user = new User({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        otp: emailOtp, // This is the EMAIL OTP
        otpExpires: Date.now() + 10 * 60 * 1000,
      });
      await user.save();
    }

    // 4. Send EMAIL OTP for verification
    const emailHtml = `<h1>Welcome!</h1><p>Your OTP for email verification is: <strong>${emailOtp}</strong></p>`;
    await sendEmail({
      email: user.email,
      subject: "Verify Your Email Address",
      html: emailHtml,
    });

    res.status(200).json({ msg: "OTP sent to your email. Please verify." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// --- verifyOtp (for registration) ---
// This function remains the same, but we update it to log user in
exports.verifyOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) return res.status(400).json({ msg: "User not found" });
      if (user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ msg: "Invalid or expired OTP" });
      }
  
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      
      // Log them in right away
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({
        msg: "Email verified successfully! You are now logged in.",
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
};

// --- UPDATED LOGIN FUNCTION ---
// Now a 2-step process. This is Step 1: Verify Password.
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body; // No OTP here
      const user = await User.findOne({ email });
  
      if (!user) return res.status(400).json({ msg: "Invalid credentials." });
      if (!user.isVerified) return res.status(401).json({ msg: "Email not verified." });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
  
      // --- THIS IS THE FIX ---
      // Check if the old user is missing a phone number
      if (!user.phoneNumber) {
        return res.status(400).json({ 
          msg: "Account error: This user has no phone number. Please re-register." 
        });
      }
      // --- END OF FIX ---

      // --- Password is correct, now send SMS OTP ---
      const smsOtp = generateOTP();
      user.otp = smsOtp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save(); // This line will no longer crash
      
      // Send the SMS
      await sendSmsOtp(user.phoneNumber, smsOtp);
  
      // Send a success message, NOT a token
      res.status(200).json({
          msg: "Password correct. An OTP has been sent to your mobile number."
      });
  
    } catch (err)
 {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
};

// --- NEW FUNCTION: Step 2 of Login ---
// Replaces 'sendLoginOtp' and the old 'login' logic
exports.verifyLoginOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ msg: "User not found" });

        // Check the OTP
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expired OTP." });
        }

        // All checks passed, clear OTP and send token
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
    
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
        res.status(200).json({
            msg: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

