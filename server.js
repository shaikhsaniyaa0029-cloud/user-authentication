const express = require('express');
const session = require('express-session');
const pool = require('./config/db');

require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;


// =========================
// MIDDLEWARE
// =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);


// =========================
// SESSION
// =========================

app.use(session({

    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60

    }
}));


// =========================
// STATIC FRONTEND
// =========================

app.use(express.static('public'));


// =========================
// AUTH ROUTES
// =========================

app.use('/api/auth', authRoutes);


// =========================
// HOME
// =========================

app.get('/', (req, res) => {
    res.send('User Authentication System is running!');
});


// =========================
// TEST DATABASE
// =========================

app.get('/test-db', async (req, res) => {

    try {

        await pool.query('SELECT 1 AS result');

        res.json({
            success: true,
            message: 'MySQL database connected successfully!',
            database: process.env.DB_NAME
        });

    } catch (error) {

        console.error('Database error:', error);

        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
});


// =========================
// START SERVER
// =========================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});