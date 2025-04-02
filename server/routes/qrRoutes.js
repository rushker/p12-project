const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Make sure all controller methods exist
router.post('/generate', 
  auth, 
  upload.single('image'), 
  qrController.generateQR || ((req, res) => res.status(501).send('Not implemented'))
);

router.post('/verify', 
  qrController.verifyQR || ((req, res) => res.status(501).send('Not implemented'))
);

router.get('/history', 
  auth, 
  qrController.getQRHistory || ((req, res) => res.status(501).send('Not implemented'))
);

module.exports = router;