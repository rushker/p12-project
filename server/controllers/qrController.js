const QRCode = require('../models/QRCode');
const fs = require('fs');
const path = require('path');

exports.generateQR = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const newQR = new QRCode({
      imageUrl: `/uploads/${req.file.filename}`,
      createdBy: req.user.id
    });

    await newQR.save();

    res.status(201).json({
      success: true,
      qrId: newQR._id,
      imageUrl: `/uploads/${req.file.filename}`
    });
  } catch (err) {
    next(err);
  }
};

exports.getQR = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);
    if (!qrCode) return res.status(404).json({ success: false, message: 'QR not found' });

    res.status(200).json({ success: true, imageUrl: qrCode.imageUrl });
  } catch (err) {
    next(err);
  }
};

exports.deleteQR = async (req, res, next) => {
  try {
    const qr = await QRCode.findById(req.params.id);
    if (!qr) return res.status(404).json({ message: 'QR not found' });

    const filePath = path.join(__dirname, '../../', qr.imageUrl);
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    await qr.remove();
    res.status(200).json({ message: 'QR deleted' });
  } catch (err) {
    next(err);
  }
};
