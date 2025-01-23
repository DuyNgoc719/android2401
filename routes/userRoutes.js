const express = require('express');
const router = express.Router();
const { register, verifyOtp, forgotPassword, resetPassword } = require('../controllers/userController');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
