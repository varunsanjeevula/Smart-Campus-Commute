const express = require('express');
const { registerUser, loginUser, sendOtp, verifyOtp, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
