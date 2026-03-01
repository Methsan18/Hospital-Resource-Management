const express = require('express');
const router = express.Router();

const fs = require("fs");
const path = require("path");

const {
  register,
  login,
  verifyUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
  getUser,
  updateUser
} = require('../controllers/appController');

const { Auth, localVariables } = require('../middleware/auth');

// AUTH ROUTES
router.post('/register', register);
router.post('/login', login);

// USER ROUTES
router.get('/user/:username', getUser);

// OTP ROUTES
router.get('/generateOTP', verifyUser, localVariables, generateOTP);
router.get('/verifyOTP', verifyUser, verifyOTP);
router.get('/createResetSession', createResetSession);
router.put('/resetPassword', resetPassword);

// UPDATE USER (JWT REQUIRED)
router.put('/updateuser', Auth, updateUser);

router.get("/dashboard", (req, res) => {
  try {
    // __dirname = be/routes
    // We go UP one level to be/
    const filePath = path.join(__dirname, "..", "ui_bundle.json");

    console.log("Reading from:", filePath);

    const data = fs.readFileSync(filePath, "utf8");

    res.status(200).json(JSON.parse(data));
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
});

module.exports = router;