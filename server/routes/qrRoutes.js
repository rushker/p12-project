const express = require('express');
const multer = require('multer');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const Image = require('../models/Image');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Multer Storage Setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Generate QR Code Route
router.post('/generate', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            console.error('❌ No image uploaded');
            return res.status(400).json({ message: 'No image uploaded' });
        }

        // Generate unique QR ID
        const qrId = uuidv4();
        const imageUrl = `data:image/png;base64,${req.file.buffer.toString('base64')}`;

        // Generate QR Code (QR Code now encodes the Image URL)
        const qrCode = await QRCode.toDataURL(imageUrl);

        if (!qrCode) {
            console.error('❌ QR Code generation failed');
            return res.status(500).json({ message: 'Failed to generate QR Code' });
        }

        // Save to Database
        const newImage = new Image({ qrId, imageUrl, user: req.user.id });
        await newImage.save();

        console.log('✅ QR Code Generated:', { qrId, qrCode });

        return res.status(201).json({ qrId, qrCode, imageUrl });
    } catch (error) {
        console.error('❌ QR Generation Error:', error);
        res.status(500).json({ message: 'Error generating QR code', error: error.message });
    }
});

module.exports = router;
