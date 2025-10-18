const { pool } = require('./config/database');

async function createServiceVariants() {
  try {
    console.log('🔄 TẠO SERVICE VARIANTS CHO TOURS...\n');

    // Lấy danh sách tours
    const toursResult = await pool.query(`
      SELECT id, name FROM services WHERE service_type = 'TOUR' AND status = 'ACTIVE'
    `);

    console.log(`📋 Tìm thấy ${toursResult.rows.length} tours cần tạo variants\n`);

    const variantsData = [
      { name: 'Người lớn', price: 2500000, currency: 'VND' },
      { name: 'Trẻ em (6-12 tuổi)', price: 1800000, currency: 'VND' },
      { name: 'Trẻ em dưới 6 tuổi', price: 800000, currency: 'VND' }
    ];

    let createdCount = 0;

    for (const tour of toursResult.rows) {
      console.log(`🎯 Tạo variants cho tour: ${tour.name} (ID: ${tour.id})`);

      for (const variant of variantsData) {
        const insertQuery = `
          INSERT INTO service_variants (service_id, name, price, currency, is_active)
          VALUES ($1, $2, $3, $4, $5)
        `;

        await pool.query(insertQuery, [
          tour.id,
          variant.name,
          variant.price,
          variant.currency,
          true
        ]);

        createdCount++;
      }
    }

    console.log(`\n✅ Đã tạo ${createdCount} service variants cho ${toursResult.rows.length} tours!`);

    // Kiểm tra lại dữ liệu
    const checkResult = await pool.query(`
      SELECT s.name, COUNT(sv.id) as variant_count
      FROM services s
      LEFT JOIN service_variants sv ON s.id = sv.service_id
      WHERE s.service_type = 'TOUR'
      GROUP BY s.id, s.name
      ORDER BY s.name
    `);

    console.log('\n📋 Kết quả sau khi tạo variants:');
    checkResult.rows.forEach(tour => {
      console.log(`  - ${tour.name}: ${tour.variant_count} variants`);
    });

  } catch (error) {
    console.error('❌ Lỗi khi tạo service variants:', error);
  } finally {
    pool.end();
  }
}

createServiceVariants();
