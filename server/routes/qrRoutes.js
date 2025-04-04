const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Generate QR
router.post('/generate', auth, upload.single('image'), qrController.generateQR);

// Get QR
router.get('/:id', auth, qrController.getQR);

// Delete QR
router.delete('/:id', auth, qrController.deleteQR);

module.exports = router;
