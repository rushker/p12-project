const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route    POST /api/qr/generate
// @desc     Generate QR code
// @access   Private
router.post('/generate', auth, upload.single('image'), qrController.generateQR);

// @route    POST /api/qr/verify
// @desc     Verify QR code
// @access   Public
router.post('/verify', qrController.verifyQR);

// @route    GET /api/qr/history
// @desc     Get user's QR history
// @access   Private
router.get('/history', auth, qrController.getQRHistory);

module.exports = router;