const pool = require('../config/database');

const createPaymentTables = async () => {
  try {
    console.log('🔄 Creating payment tables...');

    // Create payments table (updated schema)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
        amount DECIMAL(12,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'VND',
        payment_method VARCHAR(20) NOT NULL, -- 'vnpay', 'stripe', 'bank_transfer'
        status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'
        transaction_id VARCHAR(255),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create provider_accounts table for payment gateway configurations
    await pool.query(`
      CREATE TABLE IF NOT EXISTS provider_accounts (
        id SERIAL PRIMARY KEY,
        provider_id VARCHAR(50) NOT NULL, -- 'vnpay', 'stripe'
        account_name VARCHAR(100) NOT NULL,
        is_default BOOLEAN DEFAULT FALSE,
        config_data JSONB NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_provider_accounts_provider_id ON provider_accounts(provider_id);
    `);


    console.log('✅ Payment tables created successfully');
  } catch (error) {
    console.error('❌ Error creating payment tables:', error);
    throw error;
  }
};

module.exports = createPaymentTables;
