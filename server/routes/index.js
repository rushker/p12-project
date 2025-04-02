const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./authRoutes');
const qrRoutes = require('./qrRoutes');
const imageRoutes = require('./imageRoutes');

// Setup routes
router.use('/auth', authRoutes);
router.use('/qr', qrRoutes);
router.use('/images', imageRoutes);

module.exports = router;