const multer = require('multer');
const path = require('path');

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Preserve the file extension
  }
});

// Set file size limit to 5MB
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }  // 5MB limit
});

module.exports = upload;
