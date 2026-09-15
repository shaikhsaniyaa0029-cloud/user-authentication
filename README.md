# User Authentication System

A complete full-stack user authentication system built using Node.js, Express.js, MySQL, HTML, CSS, and JavaScript.

The application provides secure user registration, login, logout, session management, protected routes, and password reset functionality.

## Features

- User registration/signup
- Email uniqueness validation
- Password and confirm-password validation
- Secure password hashing using bcrypt
- User login authentication
- Session-based authentication
- Protected routes
- User logout
- Forgot password functionality
- Secure password reset using reset tokens
- Reset token expiration
- MySQL database integration
- Server-side validation
- Error handling
- Environment variable configuration
- Responsive frontend

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Authentication & Security
- bcrypt
- express-session
- dotenv
- Parameterized SQL queries

### Development Tools
- Nodemon
- XAMPP
- phpMyAdmin
- Visual Studio Code

## Project Structure

```text
user-authentication/
│
├── server.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
├── README.md
│
├── config/
│   └── db.js
│
├── controllers/
│   └── authController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── routes/
│   └── auth.js
│
├── database/
│   └── schema.sql
│
└── public/
    ├── index.html
    ├── signup.html
    ├── login.html
    ├── dashboard.html
    ├── forgot-password.html
    ├── reset-password.html
    │
    ├── css/
    │   └── style.css
    │
    └── js/
        └── auth.js