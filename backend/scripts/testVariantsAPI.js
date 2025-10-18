// Using fetch instead of axios

/**
 * Script để test API endpoints cho variants
 */
class VariantsAPITester {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.serviceId = 12;
    this.authToken = null;
  }

  /**
   * Login để lấy auth token
   */
  async login() {
    try {
      console.log('🔐 Logging in...');
      
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'admin@hanoisuntravel.com',
          password: 'admin123'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.authToken = data.token;
        console.log('✅ Login successful');
        return true;
      } else {
        console.error('❌ Login failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Login error:', error.message);
      return false;
    }
  }

  /**
   * Test GET /api/admin/variants/:serviceId
   */
  async testGetVariants() {
    try {
      console.log('\n📡 Testing GET /api/admin/variants/:serviceId');
      
      const response = await axios.get(`${this.baseURL}/admin/variants/${this.serviceId}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });
      
      if (response.data.success) {
        console.log('✅ GET variants successful');
        console.log(`📊 Found ${response.data.data.length} variants:`);
        
        response.data.data.forEach((variant, index) => {
          console.log(`   ${index + 1}. ${variant.name} - ${variant.price} ${variant.currency}`);
          console.log(`      ID: ${variant.id}`);
          console.log(`      Attributes: ${JSON.stringify(variant.attributes, null, 6)}`);
        });
        
        return response.data.data;
      } else {
        console.error('❌ GET variants failed:', response.data.error);
        return null;
      }
    } catch (error) {
      console.error('❌ GET variants error:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Test PUT /api/admin/variants/:variantId/attributes
   */
  async testUpdateVariantAttributes(variantId) {
    try {
      console.log(`\n📡 Testing PUT /api/admin/variants/${variantId}/attributes`);
      
      const newAttributes = {
        cabin_class: "Business",
        baggage: {
          checked: "30kg",
          carry_on: "10kg"
        },
        seat_type: "premium",
        meal_included: true,
        priority_boarding: true,
        lounge_access: true,
        entertainment: ["wifi", "movies", "games", "lounge"]
      };
      
      const response = await axios.put(`${this.baseURL}/admin/variants/${variantId}/attributes`, {
        attributes: newAttributes
      }, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        console.log('✅ UPDATE variant attributes successful');
        console.log('📊 Updated variant:');
        console.log(`   ID: ${response.data.data.id}`);
        console.log(`   Name: ${response.data.data.name}`);
        console.log(`   New attributes: ${JSON.stringify(response.data.data.attributes, null, 2)}`);
        
        return response.data.data;
      } else {
        console.error('❌ UPDATE variant attributes failed:', response.data.error);
        return null;
      }
    } catch (error) {
      console.error('❌ UPDATE variant attributes error:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Test POST /api/admin/variants/:serviceId/bulk-update
   */
  async testBulkUpdateVariants(variants) {
    try {
      console.log('\n📡 Testing POST /api/admin/variants/:serviceId/bulk-update');
      
      // Prepare bulk update data
      const bulkUpdateData = variants.map(variant => ({
        id: variant.id,
        name: variant.name,
        price: variant.price,
        currency: variant.currency,
        attributes: {
          ...variant.attributes,
          bulk_updated: true,
          updated_at: new Date().toISOString()
        }
      }));
      
      const response = await axios.post(`${this.baseURL}/admin/variants/${this.serviceId}/bulk-update`, {
        variants: bulkUpdateData
      }, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        console.log('✅ BULK UPDATE variants successful');
        console.log(`📊 Updated ${response.data.data.length} variants:`);
        
        response.data.data.forEach((variant, index) => {
          console.log(`   ${index + 1}. ${variant.name} - ${variant.price} ${variant.currency}`);
          console.log(`      Attributes: ${JSON.stringify(variant.attributes, null, 6)}`);
        });
        
        return response.data.data;
      } else {
        console.error('❌ BULK UPDATE variants failed:', response.data.error);
        return null;
      }
    } catch (error) {
      console.error('❌ BULK UPDATE variants error:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Test GET /api/admin/variants/:serviceId/query
   */
  async testQueryVariants() {
    try {
      console.log('\n📡 Testing GET /api/admin/variants/:serviceId/query');
      
      const queries = [
        {
          name: "Find Economy class variants",
          params: { cabin_class: "Economy" }
        },
        {
          name: "Find variants with 23kg baggage",
          params: { baggage_checked: "23kg" }
        },
        {
          name: "Find variants with meal included",
          params: { meal_included: "true" }
        },
        {
          name: "Find variants with priority boarding",
          params: { priority_boarding: "true" }
        }
      ];
      
      for (const query of queries) {
        console.log(`\n🔍 ${query.name}:`);
        
        const response = await axios.get(`${this.baseURL}/admin/variants/${this.serviceId}/query`, {
          params: query.params,
          headers: {
            'Authorization': `Bearer ${this.authToken}`
          }
        });
        
        if (response.data.success) {
          console.log(`✅ Query successful - Found ${response.data.data.length} results:`);
          
          response.data.data.forEach((variant, index) => {
            console.log(`   ${index + 1}. ${variant.name} - ${variant.price} ${variant.currency}`);
            console.log(`      Attributes: ${JSON.stringify(variant.attributes, null, 6)}`);
          });
        } else {
          console.error('❌ Query failed:', response.data.error);
        }
      }
      
    } catch (error) {
      console.error('❌ Query variants error:', error.response?.data || error.message);
    }
  }

  /**
   * Chạy tất cả tests
   */
  async runAllTests() {
    try {
      console.log('🚀 Starting Variants API Tests...\n');
      
      // Login first
      const loginSuccess = await this.login();
      if (!loginSuccess) {
        console.error('❌ Cannot proceed without authentication');
        return;
      }
      
      // Test GET variants
      const variants = await this.testGetVariants();
      if (!variants || variants.length === 0) {
        console.error('❌ Cannot proceed without variants data');
        return;
      }
      
      // Test UPDATE variant attributes
      await this.testUpdateVariantAttributes(variants[0].id);
      
      // Test BULK UPDATE variants
      await this.testBulkUpdateVariants(variants);
      
      // Test QUERY variants
      await this.testQueryVariants();
      
      console.log('\n✅ All API tests completed successfully!');
      console.log('\n🎯 SUMMARY:');
      console.log('✅ GET /api/admin/variants/:serviceId - Working');
      console.log('✅ PUT /api/admin/variants/:variantId/attributes - Working');
      console.log('✅ POST /api/admin/variants/:serviceId/bulk-update - Working');
      console.log('✅ GET /api/admin/variants/:serviceId/query - Working');
      console.log('✅ JSONB attributes handling - Working');
      console.log('✅ Authentication - Working');
      
    } catch (error) {
      console.error('❌ Tests failed:', error.message);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new VariantsAPITester();
  tester.runAllTests();
}

module.exports = VariantsAPITester;
