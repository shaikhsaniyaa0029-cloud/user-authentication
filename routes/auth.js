const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');

const authMiddleware = require('../middleware/authMiddleware');

// Signup
router.post('/signup', signup);

// Login
router.post('/login', login);

// Logout
router.post('/logout', logout);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password', resetPassword);

// Current logged-in user
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;