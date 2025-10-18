const { pool } = require('../config/database');

(async () => {
  try {
    console.log('=== Service Type Enum ===');
    const serviceTypes = await pool.query(`
      SELECT unnest(enum_range(NULL::service_type_enum))::text as value
    `);
    serviceTypes.rows.forEach(row => console.log('-', row.value));
    
    console.log('\n=== Booking Status Enum ===');
    const bookingStatus = await pool.query(`
      SELECT unnest(enum_range(NULL::booking_status_enum))::text as value
    `);
    bookingStatus.rows.forEach(row => console.log('-', row.value));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
