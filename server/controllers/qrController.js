const QRCode = require('../models/QRCode');
const multer = require('multer');

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure 'uploads/' exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Generate QR Code (No password required)
exports.generateQR = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    // Save the QR code entry to the database
    const newQR = new QRCode({
      imageUrl: `/uploads/${req.file.filename}`,
      createdBy: req.user.id
    });

    await newQR.save();

    res.status(201).json({ success: true, qrId: newQR._id });
  } catch (err) {
    next(err);
  }
};

// Retrieve Image by QR ID
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

// Export Multer middleware for use in routes
exports.upload = upload.single('image');
