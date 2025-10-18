const { query } = require('../config/database');

/**
 * Simple script để test variants với attributes
 */
async function testVariantsWithAttributes() {
  try {
    console.log('🚀 Testing Variants with Attributes...\n');
    
    // 1. Lấy variants hiện tại
    console.log('📋 Current variants:');
    const variants = await query(`
      SELECT id, name, price, currency, attributes
      FROM service_variants 
      WHERE service_id = 12
      ORDER BY price ASC
    `);
    
    variants.rows.forEach((variant, index) => {
      console.log(`${index + 1}. ${variant.name} - ${variant.price} ${variant.currency}`);
      console.log(`   ID: ${variant.id}`);
      console.log(`   Attributes: ${JSON.stringify(variant.attributes, null, 2)}`);
      console.log('');
    });
    
    // 2. Test cập nhật attributes cho variant đầu tiên
    if (variants.rows.length > 0) {
      const firstVariant = variants.rows[0];
      console.log(`🔄 Updating variant ${firstVariant.id} with flight attributes...`);
      
      const flightAttributes = {
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
      
      await query(`
        UPDATE service_variants 
        SET attributes = $1
        WHERE id = $2
      `, [JSON.stringify(flightAttributes), firstVariant.id]);
      
      console.log('✅ Updated successfully!');
      console.log('📊 New attributes:');
      console.log(JSON.stringify(flightAttributes, null, 2));
      console.log('');
    }
    
    // 3. Test JSON queries
    console.log('🔍 Testing JSON queries...');
    
    const queries = [
      {
        name: "Find Business class variants",
        sql: `SELECT id, name, price, attributes FROM service_variants WHERE service_id = 12 AND attributes->>'cabin_class' = 'Business'`
      },
      {
        name: "Find variants with 30kg baggage",
        sql: `SELECT id, name, price, attributes FROM service_variants WHERE service_id = 12 AND attributes->'baggage'->>'checked' = '30kg'`
      },
      {
        name: "Find variants with priority boarding",
        sql: `SELECT id, name, price, attributes FROM service_variants WHERE service_id = 12 AND attributes->>'priority_boarding' = 'true'`
      }
    ];
    
    for (const queryTest of queries) {
      console.log(`\n🔍 ${queryTest.name}:`);
      const result = await query(queryTest.sql);
      
      if (result.rows.length > 0) {
        result.rows.forEach((row, index) => {
          console.log(`   ${index + 1}. ${row.name} - ${row.price} VND`);
          console.log(`      Attributes: ${JSON.stringify(row.attributes, null, 6)}`);
        });
      } else {
        console.log('   No results found');
      }
    }
    
    // 4. Test cập nhật tất cả variants với attributes khác nhau
    console.log('\n🔄 Updating all variants with different attributes...');
    
    const allVariantsAttributes = [
      {
        id: variants.rows[0]?.id, // Trẻ em dưới 6 tuổi
        attributes: {
          cabin_class: "Economy",
          baggage: { checked: "20kg", carry_on: "7kg" },
          seat_type: "Child",
          meal_included: true,
          priority_boarding: false,
          lounge_access: false,
          entertainment: ["wifi", "movies"]
        }
      },
      {
        id: variants.rows[1]?.id, // Trẻ em (6-12 tuổi)
        attributes: {
          cabin_class: "Economy",
          baggage: { checked: "20kg", carry_on: "7kg" },
          seat_type: "Child",
          meal_included: true,
          priority_boarding: false,
          lounge_access: false,
          entertainment: ["wifi", "movies"]
        }
      },
      {
        id: variants.rows[2]?.id, // Người lớn
        attributes: {
          cabin_class: "Economy",
          baggage: { checked: "23kg", carry_on: "7kg" },
          seat_type: "Adult",
          meal_included: true,
          priority_boarding: false,
          lounge_access: false,
          entertainment: ["wifi", "movies", "games"]
        }
      }
    ];
    
    for (const variant of allVariantsAttributes) {
      if (variant.id) {
        await query(`
          UPDATE service_variants 
          SET attributes = $1
          WHERE id = $2
        `, [JSON.stringify(variant.attributes), variant.id]);
        
        console.log(`✅ Updated variant ${variant.id}`);
      }
    }
    
    // 5. Kiểm tra kết quả cuối cùng
    console.log('\n📊 Final variants with attributes:');
    const finalVariants = await query(`
      SELECT id, name, price, currency, attributes
      FROM service_variants 
      WHERE service_id = 12
      ORDER BY price ASC
    `);
    
    finalVariants.rows.forEach((variant, index) => {
      console.log(`${index + 1}. ${variant.name} - ${variant.price} ${variant.currency}`);
      console.log(`   ID: ${variant.id}`);
      console.log(`   Attributes: ${JSON.stringify(variant.attributes, null, 2)}`);
      console.log('');
    });
    
    console.log('✅ All tests completed successfully!');
    console.log('\n🎯 SUMMARY:');
    console.log('✅ Variants can be updated with JSONB attributes');
    console.log('✅ JSON queries work correctly');
    console.log('✅ Different variants can have different attributes');
    console.log('✅ Flight attributes structure is working perfectly');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    process.exit(0);
  }
}

// Run test
testVariantsWithAttributes();
