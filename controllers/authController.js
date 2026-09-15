const bcrypt = require('bcrypt');
const crypto = require('crypto');
const pool = require('../config/db');

// SIGN UP
const signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const [existingUsers] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Signup error:', error);

        res.status(500).json({
            success: false,
            message: 'Something went wrong during signup'
        });
    }
};


// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const [users] = await pool.query(
            'SELECT id, name, email, password FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);

        res.status(500).json({
            success: false,
            message: 'Something went wrong during login'
        });
    }
};


// LOGOUT
const logout = (req, res) => {
    req.session.destroy((error) => {

        if (error) {
            console.error('Logout error:', error);

            return res.status(500).json({
                success: false,
                message: 'Could not logout'
            });
        }

        res.clearCookie('connect.sid');

        res.json({
            success: true,
            message: 'Logout successful'
        });
    });
};


// GET CURRENT USER
const getCurrentUser = (req, res) => {
    res.json({
        success: true,
        user: req.session.user
    });
};


// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const [users] = await pool.query(
            'SELECT id, email FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Email not registered'
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        const expiry = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await pool.query(
            'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
            [resetToken, expiry, users[0].id]
        );

        const resetLink =
            `http://localhost:3000/reset-password.html?token=${resetToken}`;

        res.json({
            success: true,
            message: 'Password reset link generated',
            resetLink: resetLink
        });

    } catch (error) {
        console.error('Forgot password error:', error);

        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        });
    }
};


// RESET PASSWORD
const resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;

        if (!token || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const [users] = await pool.query(
            `SELECT id FROM users
             WHERE reset_token = ?
             AND reset_token_expiry > NOW()`,
            [token]
        );

        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `UPDATE users
             SET password = ?,
                 reset_token = NULL,
                 reset_token_expiry = NULL
             WHERE id = ?`,
            [hashedPassword, users[0].id]
        );

        res.json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.error('Reset password error:', error);

        res.status(500).json({
            success: false,
            message: 'Something went wrong while resetting password'
        });
    }
};


// EXPORT FUNCTIONS
module.exports = {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getCurrentUser
};