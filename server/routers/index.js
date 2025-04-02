const express = require('express');
const authRoutes = require('./authRoutes');
const qrRoutes = require('./qrRoutes');
const imageRoutes = require('./imageRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/qr', qrRoutes);
router.use('/images', imageRoutes);

module.exports = router;