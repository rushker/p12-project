const QRCode = require('../models/QRCode');
exports.generateQR = async (req, res, next) => {
  try {
    if (!req.file || !req.body.name || !req.body.description) {
      return res.status(400).json({ success: false, message: 'Image, name, and description are required' });
    }

    // Save the QR code entry to the database
    const newQR = new QRCode({
      imageUrl: `/uploads/${req.file.filename}`,
      name: req.body.name,
      description: req.body.description,
      createdBy: req.user.id,
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