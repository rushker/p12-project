const express = require('express');
const multer = require('multer');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const Image = require('../models/Image'); // Ensure Image model is imported
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

        // Generate QR Code (using imageUrl as the data)
        const qrCode = await QRCode.toDataURL(imageUrl);

        if (!qrCode) {
            console.error('❌ QR Code generation failed');
            return res.status(500).json({ message: 'Failed to generate QR Code' });
        }

        // Save image and QR ID to database
        const newImage = new Image({
            qrId,
            imageUrl,
            user: req.user.id,
        });

        await newImage.save();

        console.log('✅ QR Code Generated:', { qrId, imageUrl });

        return res.status(201).json({ qrId, qrCode, imageUrl });
    } catch (error) {
        console.error('❌ QR Generation Error:', error);
        res.status(500).json({ message: 'Error generating QR code', error: error.message });
    }
});

// Get All QR Codes for User
router.get('/list', authMiddleware, async (req, res) => {
    try {
        const qrCodes = await Image.find({ user: req.user.id });

        if (!qrCodes.length) {
            console.warn('⚠️ No QR codes found for this user');
        }

        res.json(qrCodes);
    } catch (error) {
        console.error('❌ Fetch QR Codes Error:', error);
        res.status(500).json({ message: 'Error fetching QR codes', error: error.message });
    }
});

module.exports = router;
