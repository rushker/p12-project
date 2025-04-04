const express = require('express');
const multer = require('multer');
const path = require('path');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const Image = require('../models/Image'); // Ensure your Image model is imported
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Multer Storage Setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Generate QR Code Route
router.post('/generate', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        // Generate unique ID
        const qrId = uuidv4();
        const imageUrl = `data:image/png;base64,${req.file.buffer.toString('base64')}`;

        // Save to MongoDB
        const newImage = new Image({
            qrId,
            imageUrl,
            user: req.user.id,
        });

        await newImage.save();

        // Generate QR Code
        const qrCode = await QRCode.toDataURL(qrId);

        return res.status(201).json({ qrId, qrCode });
    } catch (error) {
        console.error('QR Generation Error:', error);
        res.status(500).json({ message: 'Error generating QR code' });
    }
});

// Get All QR Codes for User
router.get('/list', authMiddleware, async (req, res) => {
    try {
        const qrCodes = await Image.find({ user: req.user.id });
        res.json(qrCodes);
    } catch (error) {
        console.error('Fetch QR Codes Error:', error);
        res.status(500).json({ message: 'Error fetching QR codes' });
    }
});

module.exports = router;
