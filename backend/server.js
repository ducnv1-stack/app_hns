const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'config.env') });

// Import logging utilities
const logger = require('./utils/logger');
const errorTracker = require('./utils/errorTracker');
const { errorHandler, requestLogger, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const tourRoutes = require('./routes/tours');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');
const notificationRoutes = require('./routes/notifications');

// Import admin routes
const adminTourRoutes = require('./routes/admin/tours');
const adminUserRoutes = require('./routes/admin/users');
const adminAnalyticsRoutes = require('./routes/admin/analytics');
const adminErrorLogsRoutes = require('./routes/admin/errorLogs');
const adminVariantRoutes = require('./routes/admin/variants');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - MUST be before helmet
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Security middleware - with CORS-friendly config
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Request logging middleware (must be early in the pipeline)
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - with CORS headers and placeholder fallback
const fs = require('fs');

app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Serve placeholder when requested image file is missing
app.get('/uploads/*', (req, res, next) => {
  const filePath = path.join(__dirname, req.path.replace('/uploads/', 'uploads/'));
  if (fs.existsSync(filePath)) return next();
  const placeholderPath = path.join(__dirname, 'uploads', 'placeholder-tour.jpg');
  if (fs.existsSync(placeholderPath)) {
    return res.sendFile(placeholderPath);
  }
  // fallback to 404 if no placeholder exists
  return res.status(404).send('File not found');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'HNS Booking Tour API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

// Admin Routes
app.use('/api/admin/tours', adminTourRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);
app.use('/api/admin/error-logs', adminErrorLogsRoutes);
app.use('/api/admin/variants', adminVariantRoutes);

// Error tracking middleware
app.use((err, req, res, next) => {
  // Track error before handling
  errorTracker.trackError(err, {
    endpoint: req.originalUrl,
    method: req.method,
    userId: req.user ? req.user.userId : null,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  next(err);
});

// 404 handler
app.use('*', notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server only when this file is executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info('Server started successfully', {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      apiUrl: `http://localhost:${PORT}/api`
    });
    
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api`);
    console.log(`📝 Logs directory: ${path.join(__dirname, 'logs')}`);
  });
}

module.exports = app;
