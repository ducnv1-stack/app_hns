const { query } = require('../config/database');

async function checkTableStructure() {
  try {
    console.log('🔍 Checking service_variants table structure...');
    
    const result = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'service_variants'
      ORDER BY ordinal_position
    `);
    
    console.log('✅ service_variants table structure:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Check actual data
    console.log('\n📊 Sample data from service_variants:');
    const sampleResult = await query('SELECT * FROM service_variants LIMIT 3');
    
    if (sampleResult.rows.length > 0) {
      console.log('Columns:', Object.keys(sampleResult.rows[0]));
      sampleResult.rows.forEach((row, index) => {
        console.log(`\nRecord ${index + 1}:`);
        Object.entries(row).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkTableStructure();