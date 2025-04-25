const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// Define route for login
router.post('/login', login);

// Define route for register
router.post('/register', register);

module.exports = router;
// This code defines the authentication routes for the application.