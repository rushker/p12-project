const QRCode = require('../models/QRCode');
const qrcode = require('qrcode');

exports.generateQR = async (req, res, next) => {
  try {
    const { imageUrl, password } = req.body;
    const qrData = JSON.stringify({ imageUrl, password });
    
    const qrImage = await qrcode.toDataURL(qrData);
    
    const qrCode = new QRCode({
      imageUrl,
      password,
      createdBy: req.user.id
    });
    
    await qrCode.save();
    
    res.json({ qrImage, qrId: qrCode._id });
  } catch (err) {
    next(err);
  }
};

exports.verifyQR = async (req, res, next) => {
  try {
    const { qrId, password } = req.body;
    const qrCode = await QRCode.findById(qrId);
    
    if (!qrCode || qrCode.password !== password) {
      return res.status(401).json({ message: 'Invalid QR code or password' });
    }
    
    res.json({ imageUrl: qrCode.imageUrl });
  } catch (err) {
    next(err);
  }
};