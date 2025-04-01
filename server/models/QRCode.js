const mongoose = require('mongoose');

const QRCodeSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  password: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QRCode', QRCodeSchema);