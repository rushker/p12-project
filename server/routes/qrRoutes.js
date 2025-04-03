const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const auth = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

// Generate QR (Only authenticated users)
router.post('/generate', auth, upload.single('image'), qrController.generateQR);

// Fetch QR Image (No auth required for public access)
router.get('/:id', qrController.getQR);

module.exports = router;
