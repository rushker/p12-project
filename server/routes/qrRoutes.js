const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const auth = require('../middleware/auth');

// Verify the controller functions exist
if (typeof qrController.generateQR !== 'function') {
  throw new Error('qrController.generateQR is not a function');
}

// Proper route definitions
router.post('/generate', auth, qrController.generateQR);
router.get('/:id', auth, (req, res) => {
  if (typeof qrController.getQR === 'function') {
    return qrController.getQR(req, res);
  }
  res.status(501).json({ error: 'Endpoint not implemented' });
});

module.exports = router;