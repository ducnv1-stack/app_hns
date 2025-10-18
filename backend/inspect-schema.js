const { query } = require('./config/database');

const tables = [
  'services',
  'service_details_tour',
  'service_details_hotel',
  'service_details_flight',
  'service_availabilities'
];

(async () => {
  try {
    for (const table of tables) {
      const res = await query(
        `SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_name = $1
         ORDER BY ordinal_position`,
        [table]
      );
      console.log(`\n=== ${table} ===`);
      console.table(res.rows);
    }
  } catch (error) {
    console.error('❌ Failed to inspect schema:', error);
  }
  process.exit(0);
})();
