const express = require('express');
const router = express.Router();

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

module.exports = router;
