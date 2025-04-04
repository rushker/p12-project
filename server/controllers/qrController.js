const QRCode = require('../models/QRCode');
exports.generateQR = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    // Save the QR code entry to the database
    const newQR = new QRCode({
      imageUrl: `/uploads/${req.file.filename}`, // Save image URL to MongoDB
      createdBy: req.user.id,
      name: req.body.name, // Store name and description in DB
      description: req.body.description,
    });

    await newQR.save();
    res.status(201).json({ success: true, qrId: newQR._id });
  } catch (err) {
    next(err);
  }
};


exports.getQR = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);
    if (!qrCode) {
      return res.status(404).json({ success: false, message: 'QR Code not found' });
    }

    res.status(200).json({
      success: true,
      imageUrl: qrCode.imageUrl,
      name: qrCode.name,
      description: qrCode.description,
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteQR = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findByIdAndDelete(req.params.id);
    
    if (!qrCode) {
      return res.status(404).json({ success: false, message: 'QR Code not found' });
    }

    res.status(200).json({ success: true, message: 'QR Code deleted successfully' });
  } catch (err) {
    next(err);
  }
};