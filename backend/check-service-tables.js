const { pool } = require('./config/database');

async function checkServiceTables() {
  try {
    console.log('🔍 KIỂM TRA CẤU TRÚC VÀ DỮ LIỆU CỦA 2 BẢNG QUAN TRỌNG...\n');

    // 1. KIỂM TRA BẢNG service_details_tour
    console.log('📋 BẢNG: service_details_tour');
    console.log('━'.repeat(50));

    // Cấu trúc bảng
    const structureQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'service_details_tour'
      ORDER BY ordinal_position
    `;

    const structureResult = await pool.query(structureQuery);
    console.log('📊 Cấu trúc bảng:');
    structureResult.rows.forEach(column => {
      console.log(`  - ${column.column_name}: ${column.data_type} ${column.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${column.column_default ? '(default: ' + column.column_default + ')' : ''}`);
    });

    // Dữ liệu mẫu
    const sampleQuery = `
      SELECT * FROM service_details_tour
      ORDER BY service_id
      LIMIT 5
    `;

    const sampleResult = await pool.query(sampleQuery);
    if (sampleResult.rows.length > 0) {
      console.log('\n📋 5 bản ghi mẫu:');
      sampleResult.rows.forEach((row, index) => {
        console.log(`  ${index + 1}. Service ID: ${row.service_id}`);
        console.log(`     Duration: ${row.duration_days} days`);
        console.log(`     Country: ${row.country}`);
        console.log(`     Participants: ${row.min_participants}-${row.max_participants}`);
        console.log(`     Itinerary length: ${row.itinerary ? row.itinerary.length : 0} chars`);
        console.log('');
      });
    }

    // Thống kê
    const statsQuery = `
      SELECT
        COUNT(*) as total_records,
        COUNT(DISTINCT service_id) as unique_services,
        COUNT(DISTINCT country) as unique_countries,
        AVG(duration_days) as avg_duration,
        MIN(duration_days) as min_duration,
        MAX(duration_days) as max_duration
      FROM service_details_tour
    `;

    const statsResult = await pool.query(statsQuery);
    const stats = statsResult.rows[0];
    console.log('📈 Thống kê:');
    console.log(`  - Tổng bản ghi: ${stats.total_records}`);
    console.log(`  - Số tours duy nhất: ${stats.unique_services}`);
    console.log(`  - Số quốc gia: ${stats.unique_countries}`);
    console.log(`  - Thời gian trung bình: ${Math.round(stats.avg_duration * 10) / 10} ngày`);
    console.log(`  - Thời gian ngắn nhất: ${stats.min_duration} ngày`);
    console.log(`  - Thời gian dài nhất: ${stats.max_duration} ngày`);

    console.log('\n' + '='.repeat(50));

    // 2. KIỂM TRA BẢNG service_availabilities
    console.log('📋 BẢNG: service_availabilities');
    console.log('━'.repeat(50));

    // Cấu trúc bảng
    const availStructureQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'service_availabilities'
      ORDER BY ordinal_position
    `;

    const availStructureResult = await pool.query(availStructureQuery);
    console.log('📊 Cấu trúc bảng:');
    availStructureResult.rows.forEach(column => {
      console.log(`  - ${column.column_name}: ${column.data_type} ${column.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${column.column_default ? '(default: ' + column.column_default + ')' : ''}`);
    });

    // Dữ liệu mẫu
    const availSampleQuery = `
      SELECT sa.*, sv.name as variant_name, sv.price as variant_price
      FROM service_availabilities sa
      LEFT JOIN service_variants sv ON sa.variant_id = sv.id
      ORDER BY sa.service_id, sa.start_datetime
      LIMIT 5
    `;

    const availSampleResult = await pool.query(availSampleQuery);
    if (availSampleResult.rows.length > 0) {
      console.log('\n📋 5 bản ghi mẫu:');
      availSampleResult.rows.forEach((row, index) => {
        console.log(`  ${index + 1}. Service ID: ${row.service_id}, Variant: ${row.variant_name || 'N/A'}`);
        console.log(`     Start: ${row.start_datetime}`);
        console.log(`     End: ${row.end_datetime}`);
        console.log(`     Status: ${row.status}`);
        console.log(`     Price: ${row.variant_price ? formatPrice(row.variant_price) : 'N/A'}`);
        console.log('');
      });
    }

    // Thống kê availabilities
    const availStatsQuery = `
      SELECT
        COUNT(*) as total_records,
        COUNT(DISTINCT service_id) as unique_services,
        COUNT(DISTINCT variant_id) as unique_variants,
        COUNT(CASE WHEN status = 'AVAILABLE' THEN 1 END) as available_count,
        COUNT(CASE WHEN status = 'BOOKED' THEN 1 END) as booked_count,
        COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END) as cancelled_count
      FROM service_availabilities
    `;

    const availStatsResult = await pool.query(availStatsQuery);
    const availStats = availStatsResult.rows[0];
    console.log('📈 Thống kê:');
    console.log(`  - Tổng lịch trình: ${availStats.total_records}`);
    console.log(`  - Số tours có lịch trình: ${availStats.unique_services}`);
    console.log(`  - Số variants có lịch trình: ${availStats.unique_variants}`);
    console.log(`  - Lịch trình khả dụng: ${availStats.available_count}`);
    console.log(`  - Lịch trình đã đặt: ${availStats.booked_count}`);
    console.log(`  - Lịch trình đã hủy: ${availStats.cancelled_count}`);

    // Kiểm tra lịch trình trong tương lai
    const futureQuery = `
      SELECT COUNT(*) as future_schedules
      FROM service_availabilities
      WHERE start_datetime > NOW()
    `;

    const futureResult = await pool.query(futureQuery);
    console.log(`  - Lịch trình trong tương lai: ${futureResult.rows[0].future_schedules}`);

    console.log('\n✅ KIỂM TRA HOÀN TẤT!');

  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra dữ liệu:', error);
  } finally {
    pool.end();
  }
}

function formatPrice(price) {
  if (!price) return 'N/A';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

checkServiceTables();
