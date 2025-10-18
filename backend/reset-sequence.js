const { query } = require('./config/database');

(async () => {
  try {
    await query(`SELECT setval('services_id_seq', (SELECT COALESCE(MAX(id),0) FROM services)+1)`);
    console.log('✅ services_id_seq reset');
  } catch (error) {
    console.error('❌ Failed to reset sequence:', error);
  }
  process.exit(0);
})();
