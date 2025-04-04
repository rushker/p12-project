const QRCode = require('../models/QRCode');

// Generate QR Code (No password required)
exports.generateQR = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const fullImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Save the QR code entry to the database
    const newQR = new QRCode({
      imageUrl: fullImageUrl,
      createdBy: req.user.id
    });

    await newQR.save();

    // This is the URL the frontend will encode as a QR
    const scanUrl = `${req.protocol}://${req.get('host')}/api/qr/${newQR._id}`;

    res.status(201).json({ 
      success: true, 
      qrId: newQR._id, 
      imageUrl: fullImageUrl,
      scanUrl // Used on frontend QR code
    });
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

    res.redirect(qrCode.imageUrl); // QR scan redirects directly to image
  } catch (err) {
    next(err);
  }
};
