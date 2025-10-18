const { Pool } = require('pg');
require('dotenv').config({ path: './config.env' });

console.log('🔍 Checking database connection...');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '1234',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'HNS_Booking_Tour',
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    
    // Test query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('📊 Current time:', result.rows[0].current_time);
    
    // Test tours table
    const toursResult = await client.query('SELECT COUNT(*) as count FROM services');
    console.log('📊 Services count:', toursResult.rows[0].count);
    
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('💡 Make sure PostgreSQL is running and credentials are correct');
    process.exit(1);
  }
}

testConnection();
