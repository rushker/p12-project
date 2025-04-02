require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// 1. Database Connection
connectDB();

// 2. Middleware Stack
app.use(helmet());
app.use(cors({
  origin: isProduction 
    ? process.env.CLIENT_URL 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 3. Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Request Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// 5. Health Check Endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(dbStatus === 'connected' ? 200 : 503).json({
    status: dbStatus === 'connected' ? 'healthy' : 'degraded',
    database: dbStatus,
    timestamp: new Date()
  });
});

// 6. API Routes
app.use('/api', require('./routes'));

// 7. Production Frontend Serving
if (isProduction) {
  const clientBuildPath = path.join(__dirname, '../../client/build');
  if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  } else {
    console.error('Client build directory not found at:', clientBuildPath);
  }
}

// 8. Error Handling
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(!isProduction && { stack: err.stack })
    }
  });
});

// 9. Server Initialization
const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${isProduction ? 'production' : 'development'} mode`);
  console.log(`Listening on port ${PORT}`);
});

// 10. Graceful Shutdown (Updated for Mongoose v8+)
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  
  try {
    // Close MongoDB connection (new syntax)
    await mongoose.disconnect();
    console.log('MongoDB connection closed');

    // Close HTTP server
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });

    // Force shutdown after 5 seconds
    setTimeout(() => {
      console.error('Forcing shutdown after timeout');
      process.exit(1);
    }, 5000);

  } catch (err) {
    console.error('Shutdown error:', err);
    process.exit(1);
  }
};

// Handle signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

module.exports = server;