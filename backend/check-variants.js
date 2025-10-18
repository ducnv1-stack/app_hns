const { pool } = require('./config/database');

async function checkVariants() {
  try {
    console.log('🔍 KIỂM TRA DỮ LIỆU SERVICE_VARIANTS...\n');

    const countResult = await pool.query('SELECT COUNT(*) as count FROM service_variants');
    console.log('📊 Tổng số service variants:', countResult.rows[0].count);

    if (countResult.rows[0].count === 0) {
      console.log('❌ Không có service variants nào!');
    } else {
      const variantsResult = await pool.query('SELECT * FROM service_variants LIMIT 5');
      console.log('📋 5 service variants đầu tiên:');
      variantsResult.rows.forEach((variant, index) => {
        console.log(`  ${index + 1}. Service ID: ${variant.service_id}, Name: ${variant.name}, Price: ${variant.price}, Currency: ${variant.currency}`);
      });
    }

    // Kiểm tra variants cho tour đầu tiên (ID 12)
    const tourVariants = await pool.query('SELECT * FROM service_variants WHERE service_id = 12');
    console.log(`\n🎯 Variants cho tour ID 12: ${tourVariants.rows.length}`);
    tourVariants.rows.forEach((variant, index) => {
      console.log(`  ${index + 1}. Name: ${variant.name}, Price: ${variant.price}, Currency: ${variant.currency}`);
    });

    // Kiểm tra các services có variants
    const servicesWithVariants = await pool.query(`
      SELECT s.id, s.name, COUNT(sv.id) as variant_count
      FROM services s
      LEFT JOIN service_variants sv ON s.id = sv.service_id
      WHERE s.service_type = 'TOUR'
      GROUP BY s.id, s.name
      ORDER BY variant_count DESC
    `);

    console.log('\n📋 Các tours và số variants:');
    servicesWithVariants.rows.forEach(service => {
      console.log(`  - ${service.name} (ID: ${service.id}): ${service.variant_count} variants`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    pool.end();
  }
}

checkVariants();
