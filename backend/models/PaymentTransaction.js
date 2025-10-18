const pool = require('../config/database');

class PaymentTransaction {
  // Create a new transaction log
  static async create(transactionData) {
    const {
      payment_id,
      transaction_type,
      amount,
      currency = 'VND',
      gateway_transaction_id,
      status,
      gateway_response,
      error_message
    } = transactionData;

    const query = `
      INSERT INTO payment_transactions (
        payment_id, transaction_type, amount, currency, gateway_transaction_id, status, gateway_response, error_message
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      payment_id,
      transaction_type,
      amount,
      currency,
      gateway_transaction_id,
      status,
      gateway_response ? JSON.stringify(gateway_response) : null,
      error_message
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get transactions by payment ID
  static async findByPaymentId(paymentId) {
    const query = 'SELECT * FROM payment_transactions WHERE payment_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [paymentId]);

    return result.rows;
  }

  // Get transactions by gateway transaction ID
  static async findByGatewayTransactionId(gatewayTransactionId) {
    const query = 'SELECT * FROM payment_transactions WHERE gateway_transaction_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [gatewayTransactionId]);

    return result.rows;
  }

  // Update transaction status
  static async updateStatus(transactionId, status, gatewayResponse = null, errorMessage = null) {
    const query = `
      UPDATE payment_transactions
      SET status = $2, gateway_response = $3, error_message = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const values = [transactionId, status, gatewayResponse, errorMessage];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  // Get transaction statistics
  static async getTransactionStats(paymentId = null, startDate = null, endDate = null) {
    let whereConditions = [];
    let values = [];
    let paramCount = 0;

    if (paymentId) {
      paramCount++;
      whereConditions.push(`payment_id = $${paramCount}`);
      values.push(paymentId);
    }

    if (startDate) {
      paramCount++;
      whereConditions.push(`created_at >= $${paramCount}`);
      values.push(startDate);
    }

    if (endDate) {
      paramCount++;
      whereConditions.push(`created_at <= $${paramCount}`);
      values.push(endDate);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const query = `
      SELECT
        COUNT(*) as total_transactions,
        COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_transactions,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_transactions,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_transactions,
        SUM(CASE WHEN status = 'success' THEN amount ELSE 0 END) as total_amount_processed,
        AVG(CASE WHEN status = 'success' THEN amount END) as avg_transaction_amount
      FROM payment_transactions
      ${whereClause}
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = PaymentTransaction;
