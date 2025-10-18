const { pool } = require('../config/database');

(async () => {
  try {
    console.log('🔍 KIỂM TRA CẤU TRÚC PAYMENT SYSTEM\n');

    // 1. Check payments table
    console.log('1️⃣ Cấu trúc bảng PAYMENTS:');
    const paymentsStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'payments'
      ORDER BY ordinal_position
    `);
    
    if (paymentsStructure.rows.length > 0) {
      paymentsStructure.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
      });
    } else {
      console.log('   ❌ Bảng payments không tồn tại');
    }

    // 2. Sample payment data
    console.log('\n2️⃣ Dữ liệu mẫu PAYMENTS:');
    const samplePayments = await pool.query(`
      SELECT * FROM payments LIMIT 3
    `);
    
    if (samplePayments.rows.length > 0) {
      console.log(JSON.stringify(samplePayments.rows, null, 2));
    } else {
      console.log('   ⚠️ Chưa có payment nào');
    }

    // 3. Check payment methods enum
    console.log('\n3️⃣ Payment Methods Enum:');
    const paymentMethodsEnum = await pool.query(`
      SELECT unnest(enum_range(NULL::payment_method_enum))::text as value
    `);
    
    if (paymentMethodsEnum.rows.length > 0) {
      console.log('   Available payment methods:');
      paymentMethodsEnum.rows.forEach(row => console.log(`   - ${row.value}`));
    }

    // 4. Check payment status enum
    console.log('\n4️⃣ Payment Status Enum:');
    const paymentStatusEnum = await pool.query(`
      SELECT unnest(enum_range(NULL::payment_status_enum))::text as value
    `);
    
    if (paymentStatusEnum.rows.length > 0) {
      console.log('   Available payment statuses:');
      paymentStatusEnum.rows.forEach(row => console.log(`   - ${row.value}`));
    }

    // 5. Payment statistics
    console.log('\n5️⃣ Thống kê Payments:');
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_payments,
        COUNT(*) FILTER (WHERE status = 'SUCCESS') as successful,
        COUNT(*) FILTER (WHERE status = 'PENDING') as pending,
        COUNT(*) FILTER (WHERE status = 'FAILED') as failed,
        SUM(CASE WHEN status = 'SUCCESS' THEN amount ELSE 0 END) as total_amount_success,
        COUNT(DISTINCT booking_id) as unique_bookings
      FROM payments
    `);
    
    if (stats.rows.length > 0) {
      const s = stats.rows[0];
      console.log(`   - Total payments: ${s.total_payments}`);
      console.log(`   - Successful: ${s.successful}`);
      console.log(`   - Pending: ${s.pending}`);
      console.log(`   - Failed: ${s.failed}`);
      console.log(`   - Total amount (success): ${s.total_amount_success} VND`);
      console.log(`   - Unique bookings: ${s.unique_bookings}`);
    }

    // 6. Payment by method
    console.log('\n6️⃣ Payments theo phương thức:');
    const byMethod = await pool.query(`
      SELECT 
        payment_method,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'SUCCESS' THEN amount ELSE 0 END) as total_amount
      FROM payments
      GROUP BY payment_method
      ORDER BY count DESC
    `);
    
    if (byMethod.rows.length > 0) {
      byMethod.rows.forEach(row => {
        console.log(`   - ${row.payment_method}: ${row.count} payments, ${row.total_amount} VND`);
      });
    } else {
      console.log('   ⚠️ Chưa có payment nào');
    }

    // 7. Recent payments with booking info
    console.log('\n7️⃣ Recent Payments (với booking info):');
    const recentPayments = await pool.query(`
      SELECT 
        p.id,
        p.booking_id,
        p.amount,
        p.payment_method,
        p.status,
        p.created_at,
        b.total_amount as booking_total,
        u.username
      FROM payments p
      LEFT JOIN bookings b ON p.booking_id = b.id
      LEFT JOIN users u ON b.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `);
    
    if (recentPayments.rows.length > 0) {
      recentPayments.rows.forEach(p => {
        console.log(`   - Payment #${p.id}: ${p.amount} VND (${p.payment_method}) - ${p.status}`);
        console.log(`     Booking #${p.booking_id} (Total: ${p.booking_total} VND) - User: ${p.username}`);
      });
    } else {
      console.log('   ⚠️ Chưa có payment nào');
    }

    console.log('\n✅ Hoàn thành kiểm tra!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
