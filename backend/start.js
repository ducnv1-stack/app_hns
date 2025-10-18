#!/usr/bin/env node

const { migrateTours } = require('./scripts/migrateTours');
const createPaymentTables = require('./scripts/createPaymentTables');
const createUserData = require('./scripts/createUserData');
const { query } = require('./config/database');

async function start() {
  console.log('🚀 Starting HNS Booking Tour Backend...\n');

  try {
    // Test database connection
    console.log('🔌 Testing database connection...');
    await query('SELECT NOW()');
    console.log('✅ Database connection successful\n');

    // Ensure new columns exist on services
    console.log('🛠️ Ensuring service columns exist...');
    await query(`
      ALTER TABLE IF EXISTS services
      ADD COLUMN IF NOT EXISTS base_price NUMERIC(12,2);
    `);
    console.log('✅ Service columns ensured');

    // Check if tours exist
    console.log('📊 Checking existing data...');
    const existingTours = await query('SELECT COUNT(*) as count FROM services WHERE service_type = $1', ['TOUR']);
    const tourCount = parseInt(existingTours.rows[0].count);

    if (tourCount === 0) {
      console.log('📦 No tours found. Starting migration...\n');
      await migrateTours();
    } else {
      console.log(`✅ Found ${tourCount} existing tours. Skipping migration.\n`);
    }

    // Create payment tables
    console.log('💳 Setting up payment tables...');
    await createPaymentTables();

    // Create user data (roles and demo users)
    console.log('👥 Setting up user data...');
    await createUserData();

    // Start the server
  console.log('🌐 Starting Express server...');
  const app = require('./server');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  });

  } catch (error) {
    console.error('❌ Startup failed:', error);
    process.exit(1);
  }
}

start();
