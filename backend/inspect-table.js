const { query } = require('./config/database');

const table = process.argv[2];

if (!table) {
  console.error('Usage: node inspect-table.js <table_name>');
  process.exit(1);
}

(async () => {
  try {
    const res = await query(
      `SELECT column_name, data_type, is_nullable, column_default
       FROM information_schema.columns
       WHERE table_name = $1
       ORDER BY ordinal_position`,
      [table]
    );
    console.log(`\n=== ${table} ===`);
    console.table(res.rows);
  } catch (error) {
    console.error('❌ Failed to inspect schema:', error);
  }
  process.exit(0);
})();
