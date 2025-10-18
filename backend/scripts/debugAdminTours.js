// Direct test of Tour.findAll() to see SQL error
const Tour = require('../models/Tour');

(async () => {
  try {
    console.log('Testing Tour.findAll() with filters...');
    const result = await Tour.findAll({ page: 1, limit: 10, status: 'all' });
    console.log('✅ Success! Tours:', result.tours.length);
    console.log('Pagination:', result.pagination);
    console.log('Sample tour:', JSON.stringify(result.tours[0], null, 2));
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('Stack:', err.stack);
  }
  process.exit(0);
})();
