const express = require('express');
const router = express.Router();

// Verify route files exist
const authRoutes = require('./authRoutes');
const qrRoutes = require('./qrRoutes');
const imageRoutes = require('./imageRoutes');

// Validate all route modules
[authRoutes, qrRoutes, imageRoutes].forEach(routeModule => {
  if (typeof routeModule !== 'function') {
    throw new Error(`Invalid route module: ${routeModule}`);
  }
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/qr', qrRoutes);
router.use('/images', imageRoutes);

module.exports = router;