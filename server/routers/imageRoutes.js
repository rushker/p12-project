const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route    POST /api/images/upload
// @desc     Upload image
// @access   Private
router.post('/upload', auth, upload.single('image'), imageController.uploadImage);

// @route    GET /api/images/:id
// @desc     Get image by ID
// @access   Private
router.get('/:id', auth, imageController.getImage);

module.exports = router;