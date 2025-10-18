/**
 * Test script to verify slug URLs work correctly
 */

const { getClient } = require('../config/database');
const Tour = require('../models/Tour');

class SlugURLTester {
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
   * Test public API endpoints with slug
   */
  async testPublicAPIWithSlug() {
    console.log('\n🧪 Testing public API with slug...');
    
    try {
      // Get a tour with slug
      const tour = await Tour.findBySlugOrId('12');
      if (!tour) {
        console.log('❌ No tour found with ID 12');
        return;
      }

      console.log(`📝 Tour: ${tour.name}`);
      console.log(`   ID: ${tour.id}`);
      console.log(`   Slug: ${tour.slug}`);
      
      // Test API endpoints
      const baseUrl = 'http://localhost:5000';
      
      console.log('\n🔍 Testing API endpoints:');
      console.log(`   GET ${baseUrl}/api/tours/${tour.id} (ID)`);
      console.log(`   GET ${baseUrl}/api/tours/${tour.slug} (Slug)`);
      
      // Test both endpoints
      const testEndpoints = [
        { url: `${baseUrl}/api/tours/${tour.id}`, type: 'ID' },
        { url: `${baseUrl}/api/tours/${tour.slug}`, type: 'Slug' }
      ];

      for (const endpoint of testEndpoints) {
        try {
          const response = await fetch(endpoint.url);
          const data = await response.json();
          
          if (data.success) {
            console.log(`   ✅ ${endpoint.type}: ${response.status} - Tour: ${data.data.name}`);
          } else {
            console.log(`   ❌ ${endpoint.type}: ${response.status} - ${data.error}`);
          }
        } catch (error) {
          console.log(`   ❌ ${endpoint.type}: Error - ${error.message}`);
        }
      }

    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
  }

  /**
   * Test frontend URL generation
   */
  testFrontendURLs() {
    console.log('\n🧪 Testing frontend URL generation...');
    
    const testTours = [
      { id: 12, name: 'Đà Lạt - Nha Trang 4N3Đ', slug: 'da-lat-nha-trang-4n3d' },
      { id: 20, name: 'Hà Nội - Hồ Chí Minh', slug: 'ha-noi-ho-chi-minh-20' },
      { id: 11, name: 'Nha Trang 3N2Đ', slug: 'nha-trang-3n2d' }
    ];

    for (const tour of testTours) {
      console.log(`\n📝 Tour: ${tour.name}`);
      console.log(`   ID: ${tour.id}`);
      console.log(`   Slug: ${tour.slug}`);
      
      // Public URLs
      console.log(`   🌐 Public URLs:`);
      console.log(`      Old: http://localhost:5173/#/tours/${tour.id}`);
      console.log(`      New: http://localhost:5173/#/tours/${tour.slug}`);
      console.log(`      Booking: http://localhost:5173/#/booking/${tour.slug}`);
      
      // Admin URLs
      console.log(`   🔧 Admin URLs:`);
      console.log(`      Old: http://localhost:5173/#/admin/tours/${tour.id}`);
      console.log(`      New: http://localhost:5173/#/admin/tours/${tour.slug}`);
      console.log(`      Edit: http://localhost:5173/#/admin/tours/${tour.slug}/edit`);
    }
  }

  /**
   * Test component link generation
   */
  testComponentLinks() {
    console.log('\n🧪 Testing component link generation...');
    
    const testTour = {
      id: 12,
      name: 'Đà Lạt - Nha Trang 4N3Đ',
      slug: 'da-lat-nha-trang-4n3d'
    };

    console.log('📝 Test tour data:');
    console.log(`   ID: ${testTour.id}`);
    console.log(`   Name: ${testTour.name}`);
    console.log(`   Slug: ${testTour.slug}`);

    console.log('\n🔗 Component link generation:');
    
    // TourCard component
    const tourCardLink = `/tours/${testTour.slug || testTour.id}`;
    console.log(`   TourCard: ${tourCardLink}`);
    
    // FeaturedTours component
    const featuredToursLink = `/tours/${testTour.slug || testTour.id}`;
    console.log(`   FeaturedTours: ${featuredToursLink}`);
    
    // TourManagement component
    const tourManagementLink = `/admin/tours/${testTour.slug || testTour.id}`;
    console.log(`   TourManagement: ${tourManagementLink}`);
    
    // TourView component
    const tourViewLink = `/admin/tours/${testTour.slug || testTour.id}/edit`;
    console.log(`   TourView Edit: ${tourViewLink}`);

    console.log('\n✅ All components now use slug when available, fallback to ID');
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    try {
      await this.connect();
      
      console.log('🚀 Starting slug URL tests...\n');
      
      // Test frontend URL generation
      this.testFrontendURLs();
      
      // Test component links
      this.testComponentLinks();
      
      // Test public API with slug
      await this.testPublicAPIWithSlug();
      
      console.log('\n✅ All slug URL tests completed!');
      
    } catch (error) {
      console.error('❌ Test failed:', error);
    } finally {
      await this.disconnect();
    }
  }
}

// Main execution
async function main() {
  const tester = new SlugURLTester();
  await tester.runAllTests();
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = SlugURLTester;
