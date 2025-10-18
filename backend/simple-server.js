const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Basic middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'HNS Backend is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Backend connection working!',
    data: { 
      test: 'Hello from HNS Backend',
      timestamp: new Date().toISOString()
    }
  });
});

// Mock notifications endpoint
app.get('/api/notifications', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        title: 'Welcome to HNS!',
        message: 'Your account has been created successfully.',
        type: 'info',
        read: false,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'New Tour Available',
        message: 'Check out our latest tour to Nha Trang!',
        type: 'promotion',
        read: false,
        created_at: new Date().toISOString()
      }
    ]
  });
});

// Mock tours endpoint
app.get('/api/tours', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        name: 'Buôn Mê Thuột - Pleiku 4N3Đ',
        service_type: 'TOUR',
        status: 'ACTIVE',
        duration_days: 4,
        country: 'Việt Nam',
        min_participants: 1,
        max_participants: 25,
        min_price: 800000,
        max_price: 2500000,
        currency: 'VND',
        image_count: 4,
        availability_count: 9,
        created_at: '2025-10-07T16:01:42.000Z'
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      pages: 1
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 HNS Simple Backend Server Started!');
  console.log(`📊 Server running on port ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✅ Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`✅ Notifications: http://localhost:${PORT}/api/notifications`);
  console.log(`✅ Tours: http://localhost:${PORT}/api/tours`);
  console.log('\nPress Ctrl+C to stop the server');
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
