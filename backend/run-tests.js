#!/usr/bin/env node

const { runDatabaseTests } = require('./test-database');
const { runAllTests } = require('./test-api');

async function runAllTests() {
  console.log('🧪 HNS Booking Tour - Complete Test Suite');
  console.log('='.repeat(60));
  console.log('Testing both Database and API functionality\n');
  
  // First test database
  console.log('🗄️  PHASE 1: DATABASE TESTS');
  console.log('='.repeat(40));
  const dbResults = await runDatabaseTests();
  
  // Wait a bit between tests
  console.log('\n⏳ Waiting 2 seconds before API tests...\n');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Then test API (only if database tests passed)
  if (dbResults.connection && dbResults.schema) {
    console.log('🌐 PHASE 2: API TESTS');
    console.log('='.repeat(40));
    console.log('⚠️  Make sure the server is running on port 5000!');
    console.log('   If not, run: node start.js\n');
    
    // Wait for user confirmation
    console.log('Press Enter to continue with API tests, or Ctrl+C to exit...');
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });
    
    await runAllTests();
  } else {
    console.log('\n❌ Skipping API tests due to database failures.');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 TEST SUITE COMPLETED');
  console.log('='.repeat(60));
}

// Run all tests
runAllTests()
  .then(() => {
    console.log('\n✅ All tests completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  });
