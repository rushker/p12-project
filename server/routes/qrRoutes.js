const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route    POST /api/qr/generate
// @desc     Upload image & generate QR code
// @access   Private
router.post('/generate', auth, upload.single('image'), qrController.generateQR);

// @route    GET /api/qr/:id
// @desc     Get image by QR code ID (redirect to image)
// @access   Public (for QR scanners)
router.get('/:id', qrController.getQR);

module.exports = router;
