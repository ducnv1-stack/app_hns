const { pool } = require('./config/database');

async function checkTableStructure() {
  try {
    console.log('🔍 KIỂM TRA CẤU TRÚC BẢNG SERVICE_VARIANTS...\n');

    // Kiểm tra các cột trong bảng service_variants
    const columnsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'service_variants'
      ORDER BY ordinal_position
    `);

    console.log('📋 Cấu trúc bảng service_variants:');
    columnsResult.rows.forEach(column => {
      console.log(`  - ${column.column_name}: ${column.data_type} ${column.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${column.column_default ? '(default: ' + column.column_default + ')' : ''}`);
    });

    console.log('\n✅ KIỂM TRA HOÀN TẤT!');

  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra cấu trúc bảng:', error);
  } finally {
    pool.end();
  }
}

checkTableStructure();
