const { query } = require('../config/database');

/**
 * Script để kiểm tra cấu trúc các bảng liên quan đến tour edit
 */
async function checkTourEditTableStructures() {
  try {
    console.log('🔍 Checking table structures for tour edit...\n');
    
    const tables = [
      'service_details_flight',
      'service_availabilities'
    ];
    
    for (const tableName of tables) {
      console.log(`📋 Checking ${tableName} table structure:`);
      
      const result = await query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [tableName]);
      
      if (result.rows.length > 0) {
        result.rows.forEach(row => {
          console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
        });
        
        // Show sample data
        console.log(`\n📊 Sample data from ${tableName}:`);
        const sampleResult = await query(`SELECT * FROM ${tableName} LIMIT 1`);
        
        if (sampleResult.rows.length > 0) {
          const record = sampleResult.rows[0];
          console.log('Columns:', Object.keys(record));
          console.log('\nSample record:');
          Object.entries(record).forEach(([key, value]) => {
            console.log(`  ${key}: ${value}`);
          });
        } else {
          console.log('  No data found');
        }
      } else {
        console.log(`  Table ${tableName} not found`);
      }
      
      console.log('\n' + '='.repeat(50) + '\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkTourEditTableStructures();
