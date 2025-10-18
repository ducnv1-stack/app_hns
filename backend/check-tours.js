const { pool } = require('./config/database');

async function checkTours() {
  try {
    console.log('🔍 KIỂM TRA DỮ LIỆU TOURS TRONG DATABASE...\n');

    // Đếm số tours
    const countResult = await pool.query('SELECT COUNT(*) as count FROM services WHERE service_type = $1', ['TOUR']);
    console.log('📊 Tổng số tours:', countResult.rows[0].count);

    if (countResult.rows[0].count === 0) {
      console.log('❌ Không có tours nào trong database!');
      pool.end();
      return;
    }

    // Lấy mẫu 5 tours đầu tiên
    const toursResult = await pool.query(`
      SELECT s.id, s.name, s.service_type, s.status, s.created_at
      FROM services s
      WHERE s.service_type = $1
      ORDER BY s.created_at DESC
      LIMIT 5
    `, ['TOUR']);

    console.log('\n📋 5 tours mẫu gần đây nhất:');
    toursResult.rows.forEach((tour, index) => {
      console.log(`  ${index + 1}. ID: ${tour.id} | Name: "${tour.name}" | Status: ${tour.status}`);
    });

    // Kiểm tra chi tiết của tour đầu tiên
    if (toursResult.rows.length > 0) {
      const firstTourId = toursResult.rows[0].id;
      console.log(`\n🔍 Chi tiết tour đầu tiên (ID: ${firstTourId}):`);

      // Lấy service details
      const detailResult = await pool.query(`
        SELECT * FROM service_details_tour WHERE service_id = $1
      `, [firstTourId]);

      if (detailResult.rows.length > 0) {
        const detail = detailResult.rows[0];
        console.log('  - Duration:', detail.duration_days, 'days');
        console.log('  - Country:', detail.country);
        console.log('  - Min participants:', detail.min_participants);
        console.log('  - Max participants:', detail.max_participants);
      }

      // Lấy service variants (pricing)
      const variantsResult = await pool.query(`
        SELECT * FROM service_variants WHERE service_id = $1
      `, [firstTourId]);

      if (variantsResult.rows.length > 0) {
        console.log('  - Pricing:');
        variantsResult.rows.forEach((variant, index) => {
          console.log(`    ${index + 1}. ${variant.name}: ${variant.price} ${variant.currency}`);
        });
      }
    }

    // Kiểm tra các nước có tours
    const countriesResult = await pool.query(`
      SELECT DISTINCT std.country, COUNT(*) as count
      FROM services s
      JOIN service_details_tour std ON s.id = std.service_id
      WHERE s.service_type = $1 AND std.country IS NOT NULL
      GROUP BY std.country
      ORDER BY count DESC
    `, ['TOUR']);

    if (countriesResult.rows.length > 0) {
      console.log('\n🌍 Các nước có tours:');
      countriesResult.rows.forEach(country => {
        console.log(`  - ${country.country}: ${country.count} tours`);
      });
    }

    console.log('\n✅ KIỂM TRA HOÀN TẤT!');

  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra dữ liệu:', error);
  } finally {
    pool.end();
  }
}

checkTours();
