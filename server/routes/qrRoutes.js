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
            return res.status(400).json({ message: 'No image uploaded' });
        }

        // Generate unique QR ID
        const qrId = uuidv4();
        const imageUrl = `data:image/png;base64,${req.file.buffer.toString('base64')}`;

        // Generate QR Code (linking to the image directly)
        const qrCode = await QRCode.toDataURL(imageUrl);

        // Save image and QR ID to database
        const newImage = new Image({
            qrId,
            imageUrl,
            user: req.user.id,
        });

        await newImage.save();

        // Return response with QR Code
        return res.status(201).json({ qrId, qrCode, imageUrl });
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
