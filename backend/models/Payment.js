const pool = require('../config/database-supabase');

class Payment {
  // Create a new payment
  static async create(paymentData) {
    const {
      booking_id,
      amount,
      currency = 'USD',
      payment_method,
      transaction_id = null,
      metadata = {}
    } = paymentData;

    const query = `
      INSERT INTO payments (
        booking_id, amount, currency, payment_method, transaction_id, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [booking_id, amount, currency, payment_method, transaction_id, JSON.stringify(metadata)];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  // Get payment by ID
  static async findById(paymentId) {
    const query = 'SELECT * FROM payments WHERE id = $1';
    const result = await pool.query(query, [paymentId]);

    return result.rows[0];
  }

  // Get payments by booking ID
  static async findByBookingId(bookingId) {
    const query = 'SELECT * FROM payments WHERE booking_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [bookingId]);

    return result.rows;
  }

  // Get payments by booking ID
  static async findByBookingId(bookingId) {
    const query = 'SELECT * FROM payments WHERE booking_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [bookingId]);

    return result.rows;
  }

  // Update payment status
  static async updateStatus(paymentId, status, transactionId = null, metadata = {}) {
    const fields = ['status = $2', 'updated_at = CURRENT_TIMESTAMP'];
    const values = [paymentId, status];
    let paramCount = 2;

    if (status === 'SUCCESS') {
      fields.push('paid_at = CURRENT_TIMESTAMP');
    }

    if (transactionId) {
      paramCount++;
      fields.push(`transaction_id = $${paramCount}`);
      values.push(transactionId);
    }

    if (Object.keys(metadata).length > 0) {
      paramCount++;
      fields.push(`metadata = $${paramCount}`);
      values.push(JSON.stringify(metadata));
    }

    const query = `
      UPDATE payments
      SET ${fields.join(', ')}
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Process refund
  static async processRefund(paymentId, refundAmount, refundReason) {
    const query = `
      UPDATE payments
      SET status = 'REFUNDED',
          metadata = jsonb_set(metadata, '{refund_amount}', $2::text::jsonb),
          metadata = jsonb_set(metadata, '{refund_reason}', $3::text::jsonb),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND status = 'SUCCESS'
      RETURNING *
    `;

    const result = await pool.query(query, [paymentId, refundAmount.toString(), refundReason]);

    return result.rows[0];
  }

  // Get payment statistics
  static async getPaymentStats(startDate = null, endDate = null) {
    let whereConditions = [];
    let values = [];
    let paramCount = 0;

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
        COUNT(*) as total_payments,
        SUM(CASE WHEN status = 'SUCCESS' THEN amount ELSE 0 END) as total_revenue,
        COUNT(CASE WHEN status = 'SUCCESS' THEN 1 END) as successful_payments,
        COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failed_payments,
        COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending_payments,
        COUNT(CASE WHEN status = 'REFUNDED' THEN 1 END) as refunded_payments,
        AVG(CASE WHEN status = 'SUCCESS' THEN amount END) as avg_payment_amount
      FROM payments
      ${whereClause}
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = Payment;
