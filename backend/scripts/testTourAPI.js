const express = require('express');
const app = require('../server');
const request = require('supertest');

/**
 * Test script để kiểm tra API endpoints cho tour data
 */
class TourAPITester {
  constructor() {
    this.app = app;
  }

  /**
   * Test GET /api/tours endpoint
   */
  async testGetTours() {
    try {
      console.log('🧪 Testing GET /api/tours...');
      
      const response = await request(this.app)
        .get('/api/tours')
        .expect('Content-Type', /json/);
      
      if (response.status === 200) {
        console.log('✅ GET /api/tours - SUCCESS');
        console.log(`📊 Found ${response.body.data?.length || 0} tours`);
        
        if (response.body.data && response.body.data.length > 0) {
          console.log('🎯 Sample tour data:');
          const sampleTour = response.body.data[0];
          console.log(`  - ID: ${sampleTour.id}`);
          console.log(`  - Name: ${sampleTour.name}`);
          console.log(`  - Type: ${sampleTour.service_type}`);
          console.log(`  - Status: ${sampleTour.status}`);
          console.log(`  - Duration: ${sampleTour.duration_days} days`);
          console.log(`  - Country: ${sampleTour.country}`);
        }
        
        return response.body;
      } else {
        console.log('❌ GET /api/tours - FAILED');
        console.log('Status:', response.status);
        console.log('Response:', response.body);
      }
    } catch (error) {
      console.log('❌ GET /api/tours - ERROR');
      console.error('Error:', error.message);
    }
  }

  /**
   * Test GET /api/tours/:id endpoint
   */
  async testGetTourById() {
    try {
      console.log('\n🧪 Testing GET /api/tours/1...');
      
      const response = await request(this.app)
        .get('/api/tours/1')
        .expect('Content-Type', /json/);
      
      if (response.status === 200) {
        console.log('✅ GET /api/tours/1 - SUCCESS');
        console.log('🎯 Tour details:');
        const tour = response.body.data;
        console.log(`  - Name: ${tour.name}`);
        console.log(`  - Description: ${tour.description?.substring(0, 100)}...`);
        console.log(`  - Duration: ${tour.duration_days} days`);
        console.log(`  - Country: ${tour.country}`);
        console.log(`  - Min/Max participants: ${tour.min_participants}-${tour.max_participants}`);
        
        if (tour.variants && tour.variants.length > 0) {
          console.log(`  - Variants: ${tour.variants.length} options`);
          tour.variants.forEach((variant, index) => {
            console.log(`    ${index + 1}. ${variant.name}: ${variant.price} ${variant.currency}`);
          });
        }
        
        if (tour.images && tour.images.length > 0) {
          console.log(`  - Images: ${tour.images.length} photos`);
        }
        
        return response.body;
      } else {
        console.log('❌ GET /api/tours/1 - FAILED');
        console.log('Status:', response.status);
        console.log('Response:', response.body);
      }
    } catch (error) {
      console.log('❌ GET /api/tours/1 - ERROR');
      console.error('Error:', error.message);
    }
  }

  /**
   * Test GET /api/tours/meta/countries endpoint
   */
  async testGetCountries() {
    try {
      console.log('\n🧪 Testing GET /api/tours/meta/countries...');
      
      const response = await request(this.app)
        .get('/api/tours/meta/countries')
        .expect('Content-Type', /json/);
      
      if (response.status === 200) {
        console.log('✅ GET /api/tours/meta/countries - SUCCESS');
        console.log('🌍 Countries:', response.body.data);
        return response.body;
      } else {
        console.log('❌ GET /api/tours/meta/countries - FAILED');
        console.log('Status:', response.status);
      }
    } catch (error) {
      console.log('❌ GET /api/tours/meta/countries - ERROR');
      console.error('Error:', error.message);
    }
  }

  /**
   * Test GET /api/tours/meta/categories endpoint
   */
  async testGetCategories() {
    try {
      console.log('\n🧪 Testing GET /api/tours/meta/categories...');
      
      const response = await request(this.app)
        .get('/api/tours/meta/categories')
        .expect('Content-Type', /json/);
      
      if (response.status === 200) {
        console.log('✅ GET /api/tours/meta/categories - SUCCESS');
        console.log('📂 Categories:', response.body.data);
        return response.body;
      } else {
        console.log('❌ GET /api/tours/meta/categories - FAILED');
        console.log('Status:', response.status);
      }
    } catch (error) {
      console.log('❌ GET /api/tours/meta/categories - ERROR');
      console.error('Error:', error.message);
    }
  }

  /**
   * Test tour filtering
   */
  async testTourFiltering() {
    try {
      console.log('\n🧪 Testing tour filtering...');
      
      // Test filter by country
      const response = await request(this.app)
        .get('/api/tours?country=Việt Nam')
        .expect('Content-Type', /json/);
      
      if (response.status === 200) {
        console.log('✅ Filter by country - SUCCESS');
        console.log(`📊 Tours in Vietnam: ${response.body.data?.length || 0}`);
      }
      
      // Test pagination
      const paginationResponse = await request(this.app)
        .get('/api/tours?page=1&limit=5')
        .expect('Content-Type', /json/);
      
      if (paginationResponse.status === 200) {
        console.log('✅ Pagination - SUCCESS');
        console.log(`📊 Page 1 with limit 5: ${paginationResponse.body.data?.length || 0} tours`);
      }
      
    } catch (error) {
      console.log('❌ Tour filtering - ERROR');
      console.error('Error:', error.message);
    }
  }

  /**
   * Test admin tour endpoints (requires authentication)
   */
  async testAdminTourEndpoints() {
    try {
      console.log('\n🧪 Testing admin tour endpoints...');
      
      // First, try to get admin token (this might fail if no admin user exists)
      const loginResponse = await request(this.app)
        .post('/api/auth/login')
        .send({
          email: 'admin@hanoisuntravel.com',
          password: 'admin123'
        });
      
      if (loginResponse.status === 200 && loginResponse.body.data?.token) {
        const token = loginResponse.body.data.token;
        console.log('✅ Admin authentication successful');
        
        // Test admin get tours
        const adminToursResponse = await request(this.app)
          .get('/api/admin/tours')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/);
        
        if (adminToursResponse.status === 200) {
          console.log('✅ GET /api/admin/tours - SUCCESS');
          console.log(`📊 Admin can see ${adminToursResponse.body.data?.length || 0} tours`);
        } else {
          console.log('❌ GET /api/admin/tours - FAILED');
          console.log('Status:', adminToursResponse.status);
        }
        
      } else {
        console.log('⚠️ Admin authentication failed - skipping admin tests');
      }
      
    } catch (error) {
      console.log('❌ Admin tour endpoints - ERROR');
      console.error('Error:', error.message);
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🚀 Starting Tour API tests...\n');
    
    try {
      await this.testGetTours();
      await this.testGetTourById();
      await this.testGetCountries();
      await this.testGetCategories();
      await this.testTourFiltering();
      await this.testAdminTourEndpoints();
      
      console.log('\n✅ Tour API tests completed!');
      
    } catch (error) {
      console.log('\n❌ Tour API tests failed');
      console.error('Error:', error.message);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new TourAPITester();
  tester.runAllTests().then(() => {
    console.log('✅ Tour API testing completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Tour API testing failed:', error);
    process.exit(1);
  });
}

module.exports = TourAPITester;
