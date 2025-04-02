const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');

// @route    POST /api/auth/register
// @desc     Register user
// @access   Public
router.post('/register', validateRegister, authController.register);

// @route    POST /api/auth/login
// @desc     Login user
// @access   Public
router.post('/login', validateLogin, authController.login);

// @route    GET /api/auth/me
// @desc     Get current user
// @access   Private
router.get('/me', authController.getMe);

module.exports = router;