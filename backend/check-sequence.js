const { query } = require('./config/database');

(async () => {
  try {
    const res = await query('SELECT last_value FROM services_id_seq');
    console.table(res.rows);
  } catch (error) {
    console.error('❌ Failed to check sequence:', error);
  }
  process.exit(0);
})();
