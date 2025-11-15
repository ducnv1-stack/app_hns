const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Supabase Database configuration
let dbConfig;

// Ưu tiên dùng connection string nếu có
if (process.env.SUPABASE_DB_URL || process.env.DATABASE_URL) {
  dbConfig = {
    connectionString: process.env.SUPABASE_DB_URL || process.env.DATABASE_URL,
    // SSL configuration for Supabase (required)
    ssl: {
      rejectUnauthorized: false
    },
    // Pool configuration optimized for Supabase
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 10000, // Increased timeout for cloud connection
  };
} else {
  // Fallback: Dùng individual parameters
  dbConfig = {
    user: process.env.SUPABASE_DB_USER || process.env.DB_USER,
    password: process.env.SUPABASE_DB_PASS || process.env.DB_PASS,
    host: process.env.SUPABASE_DB_HOST || process.env.DB_HOST,
    port: process.env.SUPABASE_DB_PORT || process.env.DB_PORT || 5432,
    database: process.env.SUPABASE_DB_NAME || process.env.DB_NAME,
    // SSL configuration for Supabase (required)
    ssl: {
      rejectUnauthorized: false
    },
    // Pool configuration optimized for Supabase
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 10000, // Increased timeout for cloud connection
  };
}

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to Supabase PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Supabase database connection error:', err);
  process.exit(-1);
});

// Helper function to execute queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Supabase query executed', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('❌ Supabase query error:', error);
    throw error;
  }
};

// Helper function to get a client from the pool
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;
  
  // Set a timeout of 10 seconds for cloud connections
  const timeout = setTimeout(() => {
    console.error('⚠️ A client has been checked out for more than 10 seconds!');
    console.error(`The last executed query on this client was: ${client.lastQuery}`);
  }, 10000);
  
  // Monkey patch the query method to keep track of the last query executed
  client.query = (...args) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };
  
  client.release = () => {
    // Clear the timeout
    clearTimeout(timeout);
    // Set the methods back to their original form
    client.query = query;
    client.release = release;
    return release.apply(client);
  };
  
  return client;
};

// Test Supabase connection
const testConnection = async () => {
  try {
    const result = await query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('✅ Supabase connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return false;
  }
};

module.exports = {
  pool,
  query,
  getClient,
  testConnection
};
