const Image = require('../models/Image');
const fs = require('fs');
const path = require('path');

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const image = new Image({
      filename: req.file.filename,
      path: req.file.path,
      uploadedBy: req.user.id
    });

    await image.save();
    res.status(201).json(image);
  } catch (err) {
    next(err);
  }
};

exports.getImage = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.sendFile(path.resolve(image.path));
  } catch (err) {
    next(err);
  }
};