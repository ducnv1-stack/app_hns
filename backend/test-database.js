#!/usr/bin/env node

const { query } = require('./config/database');

async function testDatabaseConnection() {
  console.log('🔌 Testing Database Connection...\n');
  
  try {
    // Test basic connection
    const result = await query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Database Connection: SUCCESS');
    console.log(`   Current Time: ${result.rows[0].current_time}`);
    console.log(`   PostgreSQL Version: ${result.rows[0].pg_version.split(' ')[0]} ${result.rows[0].pg_version.split(' ')[1]}`);
    
    return true;
  } catch (error) {
    console.log('❌ Database Connection: FAILED');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testDatabaseSchema() {
  console.log('\n📊 Testing Database Schema...\n');
  
  const tables = [
    'services',
    'service_variants', 
    'service_availabilities',
    'service_images',
    'service_details_tour',
    'bookings',
    'booking_items',
    'booking_participants',
    'parties',
    'users',
    'providers',
    'addresses'
  ];
  
  let allTablesExist = true;
  
  for (const table of tables) {
    try {
      const result = await query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )
      `, [table]);
      
      if (result.rows[0].exists) {
        console.log(`✅ Table '${table}': EXISTS`);
        
        // Get row count
        const countResult = await query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   Rows: ${countResult.rows[0].count}`);
      } else {
        console.log(`❌ Table '${table}': MISSING`);
        allTablesExist = false;
      }
    } catch (error) {
      console.log(`❌ Table '${table}': ERROR - ${error.message}`);
      allTablesExist = false;
    }
  }
  
  return allTablesExist;
}

async function testToursData() {
  console.log('\n🎯 Testing Tours Data...\n');
  
  try {
    // Check services
    const servicesResult = await query(`
      SELECT COUNT(*) as count, service_type 
      FROM services 
      GROUP BY service_type
    `);
    
    console.log('📦 Services by Type:');
    servicesResult.rows.forEach(row => {
      console.log(`   ${row.service_type}: ${row.count} services`);
    });
    
    // Check service variants
    const variantsResult = await query(`
      SELECT COUNT(*) as count, AVG(price) as avg_price, MIN(price) as min_price, MAX(price) as max_price
      FROM service_variants
    `);
    
    if (variantsResult.rows[0].count > 0) {
      console.log('\n💰 Service Variants:');
      console.log(`   Total Variants: ${variantsResult.rows[0].count}`);
      console.log(`   Average Price: ${Math.round(variantsResult.rows[0].avg_price).toLocaleString('vi-VN')} VND`);
      console.log(`   Min Price: ${Math.round(variantsResult.rows[0].min_price).toLocaleString('vi-VN')} VND`);
      console.log(`   Max Price: ${Math.round(variantsResult.rows[0].max_price).toLocaleString('vi-VN')} VND`);
    }
    
    // Check service images
    const imagesResult = await query(`
      SELECT COUNT(*) as count, COUNT(CASE WHEN is_primary = true THEN 1 END) as primary_count
      FROM service_images
    `);
    
    console.log('\n🖼️  Service Images:');
    console.log(`   Total Images: ${imagesResult.rows[0].count}`);
    console.log(`   Primary Images: ${imagesResult.rows[0].primary_count}`);
    
    // Check service availabilities
    const availabilitiesResult = await query(`
      SELECT COUNT(*) as count, 
             COUNT(CASE WHEN status = 'AVAILABLE' THEN 1 END) as available_count,
             COUNT(CASE WHEN start_datetime > NOW() THEN 1 END) as future_count
      FROM service_availabilities
    `);
    
    console.log('\n📅 Service Availabilities:');
    console.log(`   Total Availabilities: ${availabilitiesResult.rows[0].count}`);
    console.log(`   Available: ${availabilitiesResult.rows[0].available_count}`);
    console.log(`   Future Dates: ${availabilitiesResult.rows[0].future_count}`);
    
    // Check providers
    const providersResult = await query('SELECT COUNT(*) as count FROM providers');
    console.log('\n🏢 Providers:');
    console.log(`   Total Providers: ${providersResult.rows[0].count}`);
    
    return true;
  } catch (error) {
    console.log('❌ Tours Data Test: FAILED');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testSampleQueries() {
  console.log('\n🔍 Testing Sample Queries...\n');
  
  try {
    // Test complex tour query
    console.log('📋 Testing Complex Tour Query...');
    const tourQuery = `
      SELECT 
        s.id,
        s.name,
        s.service_type,
        std.duration_days,
        std.country,
        MIN(sv.price) as min_price,
        MAX(sv.price) as max_price,
        COUNT(DISTINCT si.id) as image_count,
        COUNT(DISTINCT sa.id) as availability_count
      FROM services s
      LEFT JOIN service_details_tour std ON s.id = std.service_id
      LEFT JOIN service_variants sv ON s.id = sv.service_id
      LEFT JOIN service_images si ON s.id = si.service_id
      LEFT JOIN service_availabilities sa ON s.id = sa.service_id
      WHERE s.status = 'ACTIVE'
      GROUP BY s.id, std.duration_days, std.country
      ORDER BY s.created_at DESC
      LIMIT 3
    `;
    
    const result = await query(tourQuery);
    console.log(`✅ Complex Query: SUCCESS (${result.rows.length} results)`);
    
    result.rows.forEach((tour, index) => {
      console.log(`   ${index + 1}. ${tour.name}`);
      console.log(`      Type: ${tour.service_type}, Duration: ${tour.duration_days} days`);
      console.log(`      Country: ${tour.country}, Price: ${tour.min_price?.toLocaleString('vi-VN')} VND`);
      console.log(`      Images: ${tour.image_count}, Availabilities: ${tour.availability_count}`);
    });
    
    return true;
  } catch (error) {
    console.log('❌ Sample Queries Test: FAILED');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function runDatabaseTests() {
  console.log('🗄️  Starting Database Tests...\n');
  console.log('='.repeat(50));
  
  const results = {
    connection: false,
    schema: false,
    data: false,
    queries: false
  };
  
  // Test database connection
  results.connection = await testDatabaseConnection();
  
  if (!results.connection) {
    console.log('\n❌ Database connection failed. Cannot continue with other tests.');
    return results;
  }
  
  // Test database schema
  results.schema = await testDatabaseSchema();
  
  // Test tours data
  results.data = await testToursData();
  
  // Test sample queries
  results.queries = await testSampleQueries();
  
  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 DATABASE TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`🔌 Connection: ${results.connection ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📋 Schema: ${results.schema ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📦 Data: ${results.data ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🔍 Queries: ${results.queries ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n📈 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL DATABASE TESTS PASSED!');
  } else {
    console.log('\n⚠️  Some database tests failed.');
  }
  
  return results;
}

// Run tests if called directly
if (require.main === module) {
  runDatabaseTests()
    .then(() => {
      console.log('\n✅ Database tests completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Database tests failed:', error);
      process.exit(1);
    });
}

module.exports = { runDatabaseTests };
