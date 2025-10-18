const { pool } = require('../config/database');

(async () => {
  try {
    console.log('🔍 Checking Order & Payment Structure\n');

    // 1. Check bookings table
    console.log('='.repeat(80));
    console.log('📦 BOOKINGS TABLE STRUCTURE');
    console.log('='.repeat(80));
    const bookingsSchema = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'bookings'
      ORDER BY ordinal_position
    `);
    console.table(bookingsSchema.rows);

    // 2. Check booking_items table
    console.log('\n' + '='.repeat(80));
    console.log('📋 BOOKING_ITEMS TABLE STRUCTURE');
    console.log('='.repeat(80));
    const itemsSchema = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'booking_items'
      ORDER BY ordinal_position
    `);
    console.table(itemsSchema.rows);

    // 3. Check payments table
    console.log('\n' + '='.repeat(80));
    console.log('💳 PAYMENTS TABLE STRUCTURE');
    console.log('='.repeat(80));
    const paymentsSchema = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'payments'
      ORDER BY ordinal_position
    `);
    
    if (paymentsSchema.rows.length > 0) {
      console.table(paymentsSchema.rows);
    } else {
      console.log('❌ Payments table does not exist!');
    }

    // 4. Test query for order with product info
    console.log('\n' + '='.repeat(80));
    console.log('🧪 TEST QUERY: Get Order with Product Info');
    console.log('='.repeat(80));
    
    const orderQuery = `
      SELECT 
        b.id as order_id,
        b.booking_code,
        b.total_amount,
        b.currency,
        b.status as order_status,
        b.created_at,
        p.full_name as buyer_name,
        p.email as buyer_email,
        p.phone_number as buyer_phone,
        
        -- Booking items (products)
        json_agg(
          json_build_object(
            'item_id', bi.id,
            'service_id', bi.service_id,
            'service_name', s.name,
            'service_type', s.service_type,
            'variant_id', bi.variant_id,
            'variant_name', sv.name,
            'quantity', bi.quantity,
            'unit_price', bi.unit_price,
            'total_price', bi.total_price,
            'availability_start', sa.start_datetime,
            'availability_end', sa.end_datetime
          )
        ) as products
        
      FROM bookings b
      LEFT JOIN parties p ON b.buyer_party_id = p.id
      LEFT JOIN booking_items bi ON b.id = bi.booking_id
      LEFT JOIN services s ON bi.service_id = s.id
      LEFT JOIN service_variants sv ON bi.variant_id = sv.id
      LEFT JOIN service_availabilities sa ON bi.availability_id = sa.id
      GROUP BY b.id, p.full_name, p.email, p.phone_number
      LIMIT 1
    `;

    const orderResult = await pool.query(orderQuery);
    
    if (orderResult.rows.length > 0) {
      console.log('\n✅ Sample Order Data:\n');
      console.log(JSON.stringify(orderResult.rows[0], null, 2));
    } else {
      console.log('\n⚠️  No orders found in database');
    }

    // 5. Check if payments table exists and structure
    console.log('\n' + '='.repeat(80));
    console.log('💰 PAYMENT STATUS CHECK');
    console.log('='.repeat(80));
    
    const paymentCheckQuery = `
      SELECT 
        table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%payment%'
    `;
    
    const paymentTables = await pool.query(paymentCheckQuery);
    console.log('Payment-related tables:');
    console.table(paymentTables.rows);

    // 6. Summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 SUMMARY');
    console.log('='.repeat(80));
    
    const hasBookings = bookingsSchema.rows.length > 0;
    const hasBookingItems = itemsSchema.rows.length > 0;
    const hasPayments = paymentsSchema.rows.length > 0;
    
    console.log(`
✅ Bookings table: ${hasBookings ? 'EXISTS' : 'MISSING'}
✅ Booking Items table: ${hasBookingItems ? 'EXISTS' : 'MISSING'}
${hasPayments ? '✅' : '❌'} Payments table: ${hasPayments ? 'EXISTS' : 'MISSING'}

📋 Required Information Status:
${hasBookings ? '✅' : '❌'} Order ID (booking.id)
${hasBookingItems ? '✅' : '❌'} Product ID (booking_items.service_id)
${hasBookingItems ? '✅' : '❌'} Product Variant ID (booking_items.variant_id)
${hasBookings ? '✅' : '❌'} Total Amount (booking.total_amount)
${hasPayments ? '✅' : '❌'} Payment Amount (payments.amount)
${hasPayments ? '✅' : '❌'} Payment Status (payments.status)

🔍 Product Type Classification:
${hasBookingItems ? '✅' : '❌'} Service Type (services.service_type: TOUR/FLIGHT/HOTEL/COMBO)
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
