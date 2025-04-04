const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route    POST /api/qr/generate
// @desc     Upload image & generate QR code
// @access   Private
// qrRoutes.js
router.post('/generate', auth, qrController.generateQR);  // Auth middleware if needed


// @route    GET /api/qr/:id
// @desc     Get image by QR code ID (redirect to image)
// @access   Public (for QR scanners)
router.get('/:id', qrController.getQR);

// frontend QR view
router.get('/:id/data', qrController.getQRData); 
// delete QR (auth required)
router.delete('/:id', auth, qrController.deleteQR); 

module.exports = router;
