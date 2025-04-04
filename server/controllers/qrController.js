// qrController.js
exports.generateQR = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    // Save the QR code entry to the database
    const newQR = new QRCode({
      imageUrl: `/uploads/${req.file.filename}`, // Make sure this path corresponds to the uploaded file path
      createdBy: req.user.id, // Assumes the user is authenticated
    });

    await newQR.save();

    res.status(201).json({ success: true, qrId: newQR._id });
  } catch (err) {
    next(err);
  }
};
