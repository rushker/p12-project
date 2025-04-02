module.exports = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error',
        details: err.message 
      });
    }
  
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        message: 'File too large (max 5MB)' 
      });
    }
  
    res.status(500).json({ 
      message: 'Something went wrong' 
    });
  };