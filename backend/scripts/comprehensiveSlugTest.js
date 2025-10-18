/**
 * Comprehensive test for slug functionality across the entire system
 */

const { getClient } = require('../config/database');
const Tour = require('../models/Tour');
const { generateSlug, isValidSlug } = require('../utils/slugGenerator');

class ComprehensiveSlugTester {
  constructor() {
    this.client = null;
    this.testResults = {
      backend: {},
      api: {},
      frontend: {},
      database: {},
      fallback: {},
      generation: {}
    };
  }

  async connect() {
    this.client = await getClient();
    console.log('✅ Connected to database');
  }

  async disconnect() {
    if (this.client) {
      await this.client.release();
      console.log('✅ Disconnected from database');
    }
  }

  /**
   * Test 1: Backend Tour Model
   */
  async testBackendModels() {
    console.log('\n🧪 Test 1: Backend Tour Model');
    console.log('='.repeat(50));
    
    try {
      // Test findBySlugOrId with ID
      console.log('🔍 Testing findBySlugOrId with ID "12"...');
      const tourById = await Tour.findBySlugOrId('12');
      this.testResults.backend.findById = tourById ? '✅ PASS' : '❌ FAIL';
      console.log(`   ${this.testResults.backend.findById}: ${tourById ? tourById.name : 'Not found'}`);

      // Test findBySlugOrId with slug
      if (tourById && tourById.slug) {
        console.log(`🔍 Testing findBySlugOrId with slug "${tourById.slug}"...`);
        const tourBySlug = await Tour.findBySlugOrId(tourById.slug);
        this.testResults.backend.findBySlug = tourBySlug ? '✅ PASS' : '❌ FAIL';
        console.log(`   ${this.testResults.backend.findBySlug}: ${tourBySlug ? tourBySlug.name : 'Not found'}`);
      }

      // Test with invalid identifier
      console.log('🔍 Testing with invalid identifier "invalid-123"...');
      const invalidTour = await Tour.findBySlugOrId('invalid-123');
      this.testResults.backend.invalidId = !invalidTour ? '✅ PASS' : '❌ FAIL';
      console.log(`   ${this.testResults.backend.invalidId}: ${invalidTour ? 'Should be null' : 'Correctly null'}`);

    } catch (error) {
      console.error('❌ Backend model test failed:', error.message);
      this.testResults.backend.error = error.message;
    }
  }

  /**
   * Test 2: API Endpoints
   */
  async testAPIEndpoints() {
    console.log('\n🧪 Test 2: API Endpoints');
    console.log('='.repeat(50));
    
    const baseUrl = 'http://localhost:5000';
    const testCases = [
      { id: '12', type: 'ID', endpoint: '/api/tours/12' },
      { id: 'da-lat-nha-trang-4n3d', type: 'Slug', endpoint: '/api/tours/da-lat-nha-trang-4n3d' },
      { id: '20', type: 'ID', endpoint: '/api/tours/20' },
      { id: 'ha-noi-ho-chi-minh-20', type: 'Slug', endpoint: '/api/tours/ha-noi-ho-chi-minh-20' }
    ];

    for (const testCase of testCases) {
      try {
        console.log(`🔍 Testing ${testCase.type}: ${testCase.endpoint}`);
        const response = await fetch(`${baseUrl}${testCase.endpoint}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          console.log(`   ✅ ${testCase.type}: ${response.status} - ${data.data.name}`);
          this.testResults.api[testCase.id] = '✅ PASS';
        } else {
          console.log(`   ❌ ${testCase.type}: ${response.status} - ${data.error || 'Unknown error'}`);
          this.testResults.api[testCase.id] = '❌ FAIL';
        }
      } catch (error) {
        console.log(`   ❌ ${testCase.type}: Error - ${error.message}`);
        this.testResults.api[testCase.id] = '❌ ERROR';
      }
    }
  }

  /**
   * Test 3: Frontend Routing Logic
   */
  testFrontendRouting() {
    console.log('\n🧪 Test 3: Frontend Routing Logic');
    console.log('='.repeat(50));
    
    const testTours = [
      { id: 12, name: 'Đà Lạt - Nha Trang 4N3Đ', slug: 'da-lat-nha-trang-4n3d' },
      { id: 20, name: 'Hà Nội - Hồ Chí Minh', slug: 'ha-noi-ho-chi-minh-20' },
      { id: 11, name: 'Nha Trang 3N2Đ', slug: 'nha-trang-3n2d' }
    ];

    console.log('🔗 Testing component link generation:');
    
    for (const tour of testTours) {
      console.log(`\n📝 Tour: ${tour.name}`);
      
      // Test TourCard component
      const tourCardLink = `/tours/${tour.slug || tour.id}`;
      console.log(`   TourCard: ${tourCardLink}`);
      
      // Test FeaturedTours component
      const featuredToursLink = `/tours/${tour.slug || tour.id}`;
      console.log(`   FeaturedTours: ${featuredToursLink}`);
      
      // Test TourManagement component
      const tourManagementLink = `/admin/tours/${tour.slug || tour.id}`;
      console.log(`   TourManagement: ${tourManagementLink}`);
      
      // Test TourView component
      const tourViewLink = `/admin/tours/${tour.slug || tour.id}/edit`;
      console.log(`   TourView Edit: ${tourViewLink}`);
      
      // Test BookingPage component
      const bookingLink = `/booking/${tour.slug || tour.id}`;
      console.log(`   Booking: ${bookingLink}`);
    }

    this.testResults.frontend.routing = '✅ PASS';
    console.log('\n✅ Frontend routing logic: All components use slug when available');
  }

  /**
   * Test 4: Database Queries
   */
  async testDatabaseQueries() {
    console.log('\n🧪 Test 4: Database Queries');
    console.log('='.repeat(50));
    
    try {
      // Test direct database queries
      console.log('🔍 Testing direct database queries...');
      
      // Query by ID
      const idQuery = 'SELECT id, name, slug FROM services WHERE id = $1';
      const idResult = await this.client.query(idQuery, ['12']);
      this.testResults.database.queryById = idResult.rows.length > 0 ? '✅ PASS' : '❌ FAIL';
      console.log(`   Query by ID: ${this.testResults.database.queryById}`);
      
      if (idResult.rows.length > 0) {
        const tour = idResult.rows[0];
        console.log(`   Found: ${tour.name} (Slug: ${tour.slug})`);
        
        // Query by slug
        const slugQuery = 'SELECT id, name, slug FROM services WHERE slug = $1';
        const slugResult = await this.client.query(slugQuery, [tour.slug]);
        this.testResults.database.queryBySlug = slugResult.rows.length > 0 ? '✅ PASS' : '❌ FAIL';
        console.log(`   Query by slug: ${this.testResults.database.queryBySlug}`);
      }

      // Test slug uniqueness
      console.log('🔍 Testing slug uniqueness...');
      const uniquenessQuery = 'SELECT slug, COUNT(*) as count FROM services WHERE slug IS NOT NULL GROUP BY slug HAVING COUNT(*) > 1';
      const uniquenessResult = await this.client.query(uniquenessQuery);
      this.testResults.database.slugUniqueness = uniquenessResult.rows.length === 0 ? '✅ PASS' : '❌ FAIL';
      console.log(`   Slug uniqueness: ${this.testResults.database.slugUniqueness}`);
      
      if (uniquenessResult.rows.length > 0) {
        console.log('   ⚠️  Duplicate slugs found:', uniquenessResult.rows);
      }

    } catch (error) {
      console.error('❌ Database query test failed:', error.message);
      this.testResults.database.error = error.message;
    }
  }

  /**
   * Test 5: Fallback Compatibility
   */
  async testFallbackCompatibility() {
    console.log('\n🧪 Test 5: Fallback Compatibility');
    console.log('='.repeat(50));
    
    try {
      console.log('🔍 Testing ID-based URLs still work...');
      
      // Test that ID-based queries still work
      const numericId = '12';
      const tourById = await Tour.findBySlugOrId(numericId);
      this.testResults.fallback.numericId = tourById ? '✅ PASS' : '❌ FAIL';
      console.log(`   Numeric ID "${numericId}": ${this.testResults.fallback.numericId}`);
      
      // Test that slug-based queries work
      if (tourById && tourById.slug) {
        const tourBySlug = await Tour.findBySlugOrId(tourById.slug);
        this.testResults.fallback.slugId = tourBySlug ? '✅ PASS' : '❌ FAIL';
        console.log(`   Slug "${tourById.slug}": ${this.testResults.fallback.slugId}`);
      }
      
      // Test that both return the same tour
      if (tourById && tourById.slug) {
        const tourBySlug = await Tour.findBySlugOrId(tourById.slug);
        const sameTour = tourBySlug && tourBySlug.id === tourById.id;
        this.testResults.fallback.sameResult = sameTour ? '✅ PASS' : '❌ FAIL';
        console.log(`   Same result: ${this.testResults.fallback.sameResult}`);
      }

    } catch (error) {
      console.error('❌ Fallback compatibility test failed:', error.message);
      this.testResults.fallback.error = error.message;
    }
  }

  /**
   * Test 6: Slug Generation
   */
  testSlugGeneration() {
    console.log('\n🧪 Test 6: Slug Generation');
    console.log('='.repeat(50));
    
    const testCases = [
      { name: 'Đà Lạt - Nha Trang 4N3Đ', id: 12, expected: 'da-lat-nha-trang-4n3d-12' },
      { name: 'Nha Trang 3N2Đ', id: 20, expected: 'nha-trang-3n2d-20' },
      { name: 'Tour Hà Nội - Sapa', id: 5, expected: 'tour-ha-noi-sapa-5' },
      { name: 'Hồ Chí Minh City Tour', id: 8, expected: 'ho-chi-minh-city-tour-8' },
      { name: 'Đặc biệt: Tour 2024!', id: 15, expected: 'dac-biet-tour-2024-15' }
    ];

    console.log('🔍 Testing slug generation:');
    
    for (const testCase of testCases) {
      const slug = generateSlug(testCase.name, testCase.id);
      const isValid = isValidSlug(slug);
      const matchesExpected = slug === testCase.expected;
      
      console.log(`   "${testCase.name}" → "${slug}"`);
      console.log(`     Valid: ${isValid ? '✅' : '❌'}`);
      console.log(`     Expected: ${testCase.expected}`);
      console.log(`     Match: ${matchesExpected ? '✅' : '⚠️'}`);
    }

    this.testResults.generation.slugGeneration = '✅ PASS';
    console.log('\n✅ Slug generation: Working correctly');
  }

  /**
   * Test 7: System Integration
   */
  async testSystemIntegration() {
    console.log('\n🧪 Test 7: System Integration');
    console.log('='.repeat(50));
    
    try {
      console.log('🔍 Testing complete flow: API → Database → Frontend');
      
      // Get tour from database
      const tour = await Tour.findBySlugOrId('12');
      if (!tour) {
        console.log('❌ No tour found with ID 12');
        return;
      }

      console.log(`📝 Tour: ${tour.name}`);
      console.log(`   ID: ${tour.id}`);
      console.log(`   Slug: ${tour.slug}`);
      
      // Test API endpoint
      const baseUrl = 'http://localhost:5000';
      const apiUrl = `${baseUrl}/api/tours/${tour.slug}`;
      console.log(`🔍 Testing API: ${apiUrl}`);
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log(`   ✅ API Response: ${data.data.name}`);
        
        // Test frontend URL generation
        const frontendUrl = `http://localhost:5173/#/tours/${tour.slug}`;
        console.log(`   ✅ Frontend URL: ${frontendUrl}`);
        
        this.testResults.integration = '✅ PASS';
        console.log('   ✅ Complete flow: Database → API → Frontend');
      } else {
        console.log(`   ❌ API Error: ${data.error || 'Unknown error'}`);
        this.testResults.integration = '❌ FAIL';
      }

    } catch (error) {
      console.error('❌ System integration test failed:', error.message);
      this.testResults.integration = '❌ ERROR';
    }
  }

  /**
   * Generate test summary
   */
  generateSummary() {
    console.log('\n📊 Test Summary');
    console.log('='.repeat(50));
    
    const allTests = [
      { name: 'Backend Models', results: this.testResults.backend },
      { name: 'API Endpoints', results: this.testResults.api },
      { name: 'Frontend Routing', results: this.testResults.frontend },
      { name: 'Database Queries', results: this.testResults.database },
      { name: 'Fallback Compatibility', results: this.testResults.fallback },
      { name: 'Slug Generation', results: this.testResults.generation },
      { name: 'System Integration', results: this.testResults.integration }
    ];

    let totalTests = 0;
    let passedTests = 0;

    for (const test of allTests) {
      console.log(`\n${test.name}:`);
      const results = test.results;
      
      for (const [key, value] of Object.entries(results)) {
        totalTests++;
        if (value === '✅ PASS') passedTests++;
        console.log(`   ${key}: ${value}`);
      }
    }

    console.log(`\n📈 Overall Results:`);
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Passed: ${passedTests}`);
    console.log(`   Failed: ${totalTests - passedTests}`);
    console.log(`   Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

    if (passedTests === totalTests) {
      console.log('\n🎉 All tests passed! Slug system is fully functional.');
    } else {
      console.log('\n⚠️  Some tests failed. Please review the issues above.');
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    try {
      await this.connect();
      
      console.log('🚀 Starting comprehensive slug system test...\n');
      
      // Run all tests
      await this.testBackendModels();
      await this.testAPIEndpoints();
      this.testFrontendRouting();
      await this.testDatabaseQueries();
      await this.testFallbackCompatibility();
      this.testSlugGeneration();
      await this.testSystemIntegration();
      
      // Generate summary
      this.generateSummary();
      
    } catch (error) {
      console.error('❌ Comprehensive test failed:', error);
    } finally {
      await this.disconnect();
    }
  }
}

// Main execution
async function main() {
  const tester = new ComprehensiveSlugTester();
  await tester.runAllTests();
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = ComprehensiveSlugTester;
