const QRCode = require('../models/QRCode');
const multer = require('multer');

// Generate QR Code
exports.generateQR = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    // Save the QR code entry to the database
    const newQR = new QRCode({
      imageUrl: `/uploads/${req.file.filename}`,
      createdBy: req.user.id,  // User info attached by auth middleware
    });

    await newQR.save();

    res.status(201).json({ success: true, qrId: newQR._id });
  } catch (err) {
    next(err);
  }
};

// Get QR by ID (public route for QR code scanning)
exports.getQR = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);
    if (!qrCode) {
      return res.status(404).json({ success: false, message: 'QR Code not found' });
    }

    res.status(200).json({ success: true, imageUrl: qrCode.imageUrl });
  } catch (err) {
    next(err);
  }
};

// Delete QR (requires authentication)
exports.deleteQR = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return res.status(404).json({ success: false, message: 'QR Code not found' });
    }

    // Ensure the user is the creator
    if (qrCode.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await qrCode.remove();
    res.status(200).json({ success: true, message: 'QR Code deleted' });
  } catch (err) {
    next(err);
  }
};
