require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Debug paths
console.log('Current directory:', __dirname);
console.log('Routes path:', path.join(__dirname, 'routes', 'authRoutes.js'));

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes - using absolute paths
app.use('/api/auth', require(path.join(__dirname, 'routes', 'authRoutes.js')));
app.use('/api/qr', require(path.join(__dirname, 'routes', 'qrRoutes.js')));
app.use('/api/images', require(path.join(__dirname, 'routes', 'imageRoutes.js')));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));