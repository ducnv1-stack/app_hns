const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    console.log('🔄 Running migration: add_service_type_details.sql\n');

    const sqlPath = path.join(__dirname, '../migrations/add_service_type_details.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await pool.query(sql);

    console.log('✅ Migration completed successfully!\n');
    
    // Verify tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'service_details_%'
      ORDER BY table_name
    `);
    
    console.log('📊 Service detail tables:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
})();
