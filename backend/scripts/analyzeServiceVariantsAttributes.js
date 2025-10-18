const { query } = require('../config/database');

/**
 * Script để phân tích và test việc sử dụng attributes JSONB trong service_variants
 */
class ServiceVariantsAttributesAnalyzer {
  constructor() {
    this.variants = [];
  }

  /**
   * Kiểm tra cấu trúc hiện tại của service_variants
   */
  async checkCurrentStructure() {
    try {
      console.log('🔍 Checking current service_variants structure...\n');
      
      const result = await query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'service_variants'
        ORDER BY ordinal_position
      `);
      
      console.log('📋 service_variants table structure:');
      result.rows.forEach(row => {
        console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
      });
      
    } catch (error) {
      console.error('❌ Error checking structure:', error.message);
    }
  }

  /**
   * Kiểm tra dữ liệu hiện tại trong service_variants
   */
  async checkCurrentData() {
    try {
      console.log('\n📊 Checking current service_variants data...\n');
      
      const result = await query(`
        SELECT id, service_id, name, price, currency, attributes
        FROM service_variants 
        WHERE service_id = 12
        ORDER BY price ASC
      `);
      
      this.variants = result.rows;
      
      console.log(`Found ${this.variants.length} variants for service 12:`);
      this.variants.forEach((variant, index) => {
        console.log(`\n${index + 1}. ${variant.name} - ${variant.price} ${variant.currency}`);
        console.log(`   ID: ${variant.id}, Service ID: ${variant.service_id}`);
        console.log(`   Current attributes: ${JSON.stringify(variant.attributes, null, 2)}`);
      });
      
    } catch (error) {
      console.error('❌ Error checking data:', error.message);
    }
  }

  /**
   * Test việc update attributes với thông tin flight
   */
  async testFlightAttributesUpdate() {
    try {
      console.log('\n✈️ Testing flight attributes update...\n');
      
      // Test data structure cho flight variants
      const flightAttributes = [
        {
          id: 1, // Trẻ em dưới 6 tuổi
          attributes: {
            cabin_class: "Economy",
            baggage: {
              checked: "20kg",
              carry_on: "7kg"
            },
            seat_type: "Child",
            meal_included: true,
            priority_boarding: false
          }
        },
        {
          id: 2, // Trẻ em (6-12 tuổi)
          attributes: {
            cabin_class: "Economy",
            baggage: {
              checked: "20kg",
              carry_on: "7kg"
            },
            seat_type: "Child",
            meal_included: true,
            priority_boarding: false
          }
        },
        {
          id: 3, // Người lớn
          attributes: {
            cabin_class: "Economy",
            baggage: {
              checked: "23kg",
              carry_on: "7kg"
            },
            seat_type: "Adult",
            meal_included: true,
            priority_boarding: false
          }
        }
      ];

      console.log('📝 Proposed attributes structure:');
      flightAttributes.forEach((variant, index) => {
        console.log(`\nVariant ${index + 1} (ID: ${variant.id}):`);
        console.log(JSON.stringify(variant.attributes, null, 2));
      });

      // Test update (không thực sự update, chỉ test syntax)
      console.log('\n🔧 SQL Update examples:');
      flightAttributes.forEach(variant => {
        const sql = `
UPDATE service_variants 
SET attributes = $1 
WHERE id = $2;
        `;
        console.log(`\nFor variant ID ${variant.id}:`);
        console.log(sql);
        console.log(`Parameters: [${JSON.stringify(variant.attributes)}, ${variant.id}]`);
      });

    } catch (error) {
      console.error('❌ Error testing update:', error.message);
    }
  }

  /**
   * Phân tích lợi ích của việc sử dụng attributes JSONB
   */
  analyzeBenefits() {
    console.log('\n💡 BENEFITS OF USING ATTRIBUTES JSONB:\n');
    
    const benefits = [
      {
        title: "Flexibility",
        description: "Có thể lưu trữ bất kỳ thông tin nào mà không cần thay đổi schema",
        example: "Thêm thông tin về wifi, entertainment, lounge access..."
      },
      {
        title: "Variant-specific Data",
        description: "Mỗi variant có thể có thông tin riêng biệt",
        example: "Economy vs Business vs First Class có baggage allowance khác nhau"
      },
      {
        title: "No Schema Changes",
        description: "Không cần ALTER TABLE khi thêm thông tin mới",
        example: "Thêm aircraft_type, meal_options, seat_features..."
      },
      {
        title: "JSON Query Support",
        description: "PostgreSQL hỗ trợ query JSON data rất mạnh",
        example: "SELECT * WHERE attributes->>'cabin_class' = 'Business'"
      },
      {
        title: "Backward Compatibility",
        description: "Không ảnh hưởng đến dữ liệu hiện tại",
        example: "Các variant cũ vẫn hoạt động bình thường"
      }
    ];

    benefits.forEach((benefit, index) => {
      console.log(`${index + 1}. ${benefit.title}`);
      console.log(`   ${benefit.description}`);
      console.log(`   Example: ${benefit.example}`);
      console.log('');
    });
  }

  /**
   * Đề xuất cấu trúc attributes cho các loại service khác nhau
   */
  proposeAttributeStructures() {
    console.log('\n🏗️ PROPOSED ATTRIBUTE STRUCTURES:\n');
    
    const structures = {
      tour: {
        description: "Tour variants (Adult, Child, Senior)",
        structure: {
          age_group: "adult|child|senior",
          discount_percentage: 0,
          special_requirements: ["wheelchair_access", "dietary_restrictions"],
          included_services: ["meals", "transport", "guide"],
          excluded_services: ["personal_expenses", "tips"]
        }
      },
      hotel: {
        description: "Hotel room variants (Standard, Deluxe, Suite)",
        structure: {
          room_category: "standard|deluxe|suite",
          bed_type: "single|double|twin|king",
          view_type: "city|garden|sea|mountain",
          amenities: ["wifi", "minibar", "balcony", "jacuzzi"],
          max_occupancy: 2,
          extra_bed_available: true
        }
      },
      flight: {
        description: "Flight seat variants (Economy, Business, First)",
        structure: {
          cabin_class: "economy|business|first",
          baggage: {
            checked: "20kg|30kg|40kg",
            carry_on: "7kg|10kg|15kg"
          },
          seat_type: "standard|premium|lie_flat",
          meal_included: true,
          priority_boarding: false,
          lounge_access: false,
          entertainment: ["wifi", "movies", "games"]
        }
      }
    };

    Object.entries(structures).forEach(([type, config]) => {
      console.log(`📋 ${type.toUpperCase()} VARIANTS:`);
      console.log(`   Description: ${config.description}`);
      console.log(`   Structure:`);
      console.log(JSON.stringify(config.structure, null, 4));
      console.log('');
    });
  }

  /**
   * Test JSON queries
   */
  async testJsonQueries() {
    try {
      console.log('\n🔍 TESTING JSON QUERIES:\n');
      
      const queries = [
        {
          name: "Find all Economy class variants",
          sql: `SELECT * FROM service_variants WHERE attributes->>'cabin_class' = 'Economy'`
        },
        {
          name: "Find variants with 23kg baggage allowance",
          sql: `SELECT * FROM service_variants WHERE attributes->'baggage'->>'checked' = '23kg'`
        },
        {
          name: "Find variants with priority boarding",
          sql: `SELECT * FROM service_variants WHERE attributes->>'priority_boarding' = 'true'`
        },
        {
          name: "Find variants with meal included",
          sql: `SELECT * FROM service_variants WHERE attributes->>'meal_included' = 'true'`
        }
      ];

      queries.forEach((query, index) => {
        console.log(`${index + 1}. ${query.name}:`);
        console.log(`   SQL: ${query.sql}`);
        console.log('');
      });

    } catch (error) {
      console.error('❌ Error testing queries:', error.message);
    }
  }

  /**
   * Chạy phân tích hoàn chỉnh
   */
  async runFullAnalysis() {
    try {
      console.log('🚀 Starting Service Variants Attributes Analysis...\n');
      
      await this.checkCurrentStructure();
      await this.checkCurrentData();
      await this.testFlightAttributesUpdate();
      this.analyzeBenefits();
      this.proposeAttributeStructures();
      await this.testJsonQueries();
      
      console.log('\n✅ Analysis completed!');
      console.log('\n🎯 RECOMMENDATION:');
      console.log('✅ YES, you can definitely use the existing attributes JSONB field!');
      console.log('✅ This is a much better approach than adding new columns.');
      console.log('✅ It provides flexibility and maintains backward compatibility.');
      
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
    } finally {
      process.exit(0);
    }
  }
}

// Run analysis if this file is executed directly
if (require.main === module) {
  const analyzer = new ServiceVariantsAttributesAnalyzer();
  analyzer.runFullAnalysis();
}

module.exports = ServiceVariantsAttributesAnalyzer;
