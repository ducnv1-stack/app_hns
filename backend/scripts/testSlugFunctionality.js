/**
 * Test script for slug functionality
 */

const { getClient } = require('../config/database');
const Tour = require('../models/Tour');
const { generateSlug, isValidSlug } = require('../utils/slugGenerator');

class SlugTester {
  constructor() {
    this.client = null;
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
   * Test slug generation
   */
  testSlugGeneration() {
    console.log('\n🧪 Testing slug generation...');
    
    const testCases = [
      { name: 'Đà Lạt - Nha Trang 4N3Đ', id: 12, expected: 'da-lat-nha-trang-4n3d-12' },
      { name: 'Nha Trang 3N2Đ', id: 20, expected: 'nha-trang-3n2d-20' },
      { name: 'Tour Hà Nội - Sapa', id: 5, expected: 'tour-ha-noi-sapa-5' },
      { name: 'Hồ Chí Minh City Tour', id: 8, expected: 'ho-chi-minh-city-tour-8' },
      { name: 'Đặc biệt: Tour 2024!', id: 15, expected: 'dac-biet-tour-2024-15' }
    ];

    for (const testCase of testCases) {
      const slug = generateSlug(testCase.name, testCase.id);
      const isValid = isValidSlug(slug);
      
      console.log(`📝 "${testCase.name}" → "${slug}" (Valid: ${isValid})`);
      
      if (slug === testCase.expected) {
        console.log(`   ✅ Expected: ${testCase.expected}`);
      } else {
        console.log(`   ⚠️  Expected: ${testCase.expected}`);
      }
    }
  }

  /**
   * Test database queries
   */
  async testDatabaseQueries() {
    console.log('\n🧪 Testing database queries...');
    
    try {
      // Test finding by ID
      console.log('🔍 Testing findBySlugOrId with ID "12"...');
      const tourById = await Tour.findBySlugOrId('12');
      if (tourById) {
        console.log(`   ✅ Found tour by ID: ${tourById.name} (ID: ${tourById.id})`);
        console.log(`   📝 Slug: ${tourById.slug || 'No slug'}`);
      } else {
        console.log('   ❌ Tour not found by ID');
      }

      // Test finding by slug (if exists)
      if (tourById && tourById.slug) {
        console.log(`🔍 Testing findBySlugOrId with slug "${tourById.slug}"...`);
        const tourBySlug = await Tour.findBySlugOrId(tourById.slug);
        if (tourBySlug) {
          console.log(`   ✅ Found tour by slug: ${tourBySlug.name} (ID: ${tourBySlug.id})`);
        } else {
          console.log('   ❌ Tour not found by slug');
        }
      }

      // Test with non-existent ID
      console.log('🔍 Testing with non-existent ID "999"...');
      const nonExistent = await Tour.findBySlugOrId('999');
      if (nonExistent) {
        console.log('   ❌ Should not find tour with ID 999');
      } else {
        console.log('   ✅ Correctly returned null for non-existent ID');
      }

      // Test with invalid slug
      console.log('🔍 Testing with invalid slug "invalid-slug-123"...');
      const invalidSlug = await Tour.findBySlugOrId('invalid-slug-123');
      if (invalidSlug) {
        console.log('   ❌ Should not find tour with invalid slug');
      } else {
        console.log('   ✅ Correctly returned null for invalid slug');
      }

    } catch (error) {
      console.error('❌ Database query test failed:', error.message);
    }
  }

  /**
   * Test API endpoint simulation
   */
  async testAPIEndpointSimulation() {
    console.log('\n🧪 Testing API endpoint simulation...');
    
    const testIdentifiers = ['12', 'da-lat-nha-trang-4n3d-12', 'invalid-id', '999'];
    
    for (const identifier of testIdentifiers) {
      try {
        console.log(`🔍 Testing identifier: "${identifier}"`);
        
        const tour = await Tour.findBySlugOrId(identifier);
        
        if (tour) {
          console.log(`   ✅ Found: ${tour.name} (ID: ${tour.id}, Slug: ${tour.slug || 'N/A'})`);
        } else {
          console.log(`   ❌ Not found: ${identifier}`);
        }
        
      } catch (error) {
        console.error(`   ❌ Error testing ${identifier}:`, error.message);
      }
    }
  }

  /**
   * Show current tour slugs
   */
  async showCurrentSlugs() {
    console.log('\n📋 Current tour slugs:');
    
    try {
      const query = `
        SELECT id, name, slug, service_type
        FROM services 
        WHERE service_type = 'TOUR'
        ORDER BY id ASC
      `;
      
      const result = await this.client.query(query);
      const tours = result.rows;
      
      console.log('ID | Name | Slug | Status');
      console.log('---|------|------|--------');
      
      for (const tour of tours) {
        const name = tour.name.length > 30 ? tour.name.substring(0, 30) + '...' : tour.name;
        const slug = tour.slug || 'N/A';
        const status = tour.slug ? '✅' : '❌';
        console.log(`${tour.id} | ${name} | ${slug} | ${status}`);
      }
      
    } catch (error) {
      console.error('❌ Failed to show current slugs:', error.message);
    }
  }

  /**
   * Test URL generation
   */
  testURLGeneration() {
    console.log('\n🧪 Testing URL generation...');
    
    const testTours = [
      { id: 12, name: 'Đà Lạt - Nha Trang 4N3Đ', slug: 'da-lat-nha-trang-4n3d-12' },
      { id: 20, name: 'Nha Trang 3N2Đ', slug: 'nha-trang-3n2d-20' }
    ];

    for (const tour of testTours) {
      console.log(`\n📝 Tour: ${tour.name}`);
      console.log(`   ID: ${tour.id}`);
      console.log(`   Slug: ${tour.slug}`);
      console.log(`   URL (ID): /admin/tours/${tour.id}/edit`);
      console.log(`   URL (Slug): /admin/tours/${tour.slug}/edit`);
      console.log(`   API (ID): /api/admin/tours/${tour.id}`);
      console.log(`   API (Slug): /api/admin/tours/${tour.slug}`);
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    try {
      await this.connect();
      
      console.log('🚀 Starting slug functionality tests...\n');
      
      // Test slug generation
      this.testSlugGeneration();
      
      // Show current slugs
      await this.showCurrentSlugs();
      
      // Test database queries
      await this.testDatabaseQueries();
      
      // Test API endpoint simulation
      await this.testAPIEndpointSimulation();
      
      // Test URL generation
      this.testURLGeneration();
      
      console.log('\n✅ All tests completed!');
      
    } catch (error) {
      console.error('❌ Test failed:', error);
    } finally {
      await this.disconnect();
    }
  }
}

// Main execution
async function main() {
  const tester = new SlugTester();
  await tester.runAllTests();
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = SlugTester;
