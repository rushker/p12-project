const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./authRoutes');
const qrRoutes = require('./qrRoutes');
const imageRoutes = require('./imageRoutes');

// Mount routes
router.use('/auth', authRoutes);   // For authentication routes (login, register)
router.use('/qr', qrRoutes);       // For QR code generation and viewing
router.use('/images', imageRoutes); // For image upload and viewing

module.exports = router;
