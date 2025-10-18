const { query } = require('../config/database');

/**
 * Script để kiểm tra cấu trúc bảng services
 */
async function checkServicesTableStructure() {
  try {
    console.log('🔍 Checking services table structure...');
    
    const result = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'services'
      ORDER BY ordinal_position
    `);
    
    console.log('✅ services table structure:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
    });
    
    console.log('\n📊 Sample data from services:');
    const sampleResult = await query('SELECT * FROM services WHERE id = 12 LIMIT 1');
    
    if (sampleResult.rows.length > 0) {
      const service = sampleResult.rows[0];
      console.log('Columns:', Object.keys(service));
      console.log('\nRecord for service ID 12:');
      Object.entries(service).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkServicesTableStructure();
