const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');  // Ensure upload middleware is used for file handling

// Route to generate QR code from an uploaded image (private)
router.post('/generate', auth, upload.single('image'), qrController.generateQR);

// Route to get the QR code data (public)
router.get('/:id', qrController.getQR);

// Route to get the QR code data (for frontend usage)
router.get('/:id/data', qrController.getQR);

// Route to delete QR code (private)
router.delete('/:id', auth, qrController.deleteQR);

module.exports = router;
