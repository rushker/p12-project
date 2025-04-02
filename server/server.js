require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Debug paths - can remove after fixing
console.log('Current directory:', __dirname);
console.log('Routes contents:', fs.readdirSync(path.join(__dirname, 'routes')));

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes - using absolute path
app.use('/api', require(path.join(__dirname, 'routes', 'index.js')));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));