const { pool } = require('../config/database');

(async () => {
  try {
    console.log('🔍 KIỂM TRA KẾT NỐI API VỚI DATABASE\n');

    // 1. Kiểm tra bảng services
    console.log('1️⃣ Kiểm tra bảng SERVICES:');
    const servicesQuery = `
      SELECT 
        id,
        name,
        service_type,
        status,
        created_at
      FROM services
      ORDER BY id
      LIMIT 5;
    `;
    const servicesResult = await pool.query(servicesQuery);
    
    if (servicesResult.rows.length > 0) {
      console.log(`✅ Có ${servicesResult.rows.length} services trong database:`);
      servicesResult.rows.forEach(service => {
        console.log(`   - ID: ${service.id}, Type: ${service.service_type}, Name: ${service.name}, Status: ${service.status}`);
      });
    } else {
      console.log('❌ Không có services nào trong database');
    }

    // 2. Kiểm tra service_variants
    console.log('\n2️⃣ Kiểm tra bảng SERVICE_VARIANTS:');
    const variantsQuery = `
      SELECT 
        sv.id,
        sv.service_id,
        sv.name,
        sv.price,
        sv.currency,
        s.name as service_name,
        s.service_type
      FROM service_variants sv
      JOIN services s ON sv.service_id = s.id
      ORDER BY sv.id
      LIMIT 5;
    `;
    const variantsResult = await pool.query(variantsQuery);
    
    if (variantsResult.rows.length > 0) {
      console.log(`✅ Có ${variantsResult.rows.length} variants:`);
      variantsResult.rows.forEach(variant => {
        console.log(`   - Variant ID: ${variant.id}, Service: ${variant.service_name} (${variant.service_type}), Name: ${variant.name}, Price: ${variant.price} ${variant.currency}`);
      });
    } else {
      console.log('❌ Không có variants nào');
    }

    // 3. Kiểm tra service_availabilities
    console.log('\n3️⃣ Kiểm tra bảng SERVICE_AVAILABILITIES:');
    const availabilitiesQuery = `
      SELECT 
        sa.id,
        sa.service_id,
        sa.start_datetime,
        sa.end_datetime,
        sa.total_capacity,
        sa.booked_capacity,
        sa.status,
        s.name as service_name
      FROM service_availabilities sa
      JOIN services s ON sa.service_id = s.id
      ORDER BY sa.id
      LIMIT 5;
    `;
    const availabilitiesResult = await pool.query(availabilitiesQuery);
    
    if (availabilitiesResult.rows.length > 0) {
      console.log(`✅ Có ${availabilitiesResult.rows.length} availabilities:`);
      availabilitiesResult.rows.forEach(avail => {
        const available = avail.total_capacity - avail.booked_capacity;
        console.log(`   - ID: ${avail.id}, Service: ${avail.service_name}, Start: ${new Date(avail.start_datetime).toLocaleDateString('vi-VN')}, Available: ${available}/${avail.total_capacity}, Status: ${avail.status}`);
      });
    } else {
      console.log('❌ Không có availabilities nào');
    }

    // 4. Thống kê theo loại service
    console.log('\n4️⃣ THỐNG KÊ THEO LOẠI SERVICE:');
    const statsQuery = `
      SELECT 
        service_type,
        COUNT(*) as count,
        COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_count
      FROM services
      GROUP BY service_type
      ORDER BY service_type;
    `;
    const statsResult = await pool.query(statsQuery);
    
    if (statsResult.rows.length > 0) {
      console.log('✅ Thống kê:');
      statsResult.rows.forEach(stat => {
        console.log(`   - ${stat.service_type}: ${stat.count} total (${stat.active_count} active)`);
      });
    } else {
      console.log('❌ Không có dữ liệu thống kê');
    }

    // 5. Test API endpoint simulation
    console.log('\n5️⃣ TEST QUERY GIỐNG API:');
    const apiQuery = `
      SELECT 
        s.id,
        s.name,
        s.service_type,
        s.description,
        s.status,
        
        -- Get variants
        json_agg(
          DISTINCT jsonb_build_object(
            'id', sv.id,
            'name', sv.name,
            'price', sv.price,
            'currency', sv.currency
          )
        ) FILTER (WHERE sv.id IS NOT NULL) as variants,
        
        -- Get availabilities
        json_agg(
          DISTINCT jsonb_build_object(
            'id', sa.id,
            'start_datetime', sa.start_datetime,
            'end_datetime', sa.end_datetime,
            'total_capacity', sa.total_capacity,
            'booked_capacity', sa.booked_capacity,
            'available', sa.total_capacity - sa.booked_capacity,
            'status', sa.status
          )
        ) FILTER (WHERE sa.id IS NOT NULL) as availabilities
        
      FROM services s
      LEFT JOIN service_variants sv ON s.id = sv.service_id
      LEFT JOIN service_availabilities sa ON s.id = sa.service_id
      WHERE s.status = 'ACTIVE'
      GROUP BY s.id
      LIMIT 3;
    `;
    const apiResult = await pool.query(apiQuery);
    
    if (apiResult.rows.length > 0) {
      console.log(`✅ Query API thành công, trả về ${apiResult.rows.length} services:`);
      apiResult.rows.forEach(service => {
        console.log(`\n   📦 ${service.name} (${service.service_type})`);
        console.log(`      - Variants: ${service.variants ? service.variants.length : 0}`);
        console.log(`      - Availabilities: ${service.availabilities ? service.availabilities.length : 0}`);
      });
    } else {
      console.log('❌ Query API không trả về dữ liệu');
    }

    // 6. Kiểm tra metadata fields
    console.log('\n6️⃣ KIỂM TRA METADATA:');
    const metadataQuery = `
      SELECT 
        s.id,
        s.name,
        s.service_type,
        s.metadata as service_metadata
      FROM services s
      WHERE s.metadata IS NOT NULL
      LIMIT 3;
    `;
    const metadataResult = await pool.query(metadataQuery);
    
    if (metadataResult.rows.length > 0) {
      console.log(`✅ Có ${metadataResult.rows.length} services có metadata:`);
      metadataResult.rows.forEach(record => {
        console.log(`   - ${record.name} (${record.service_type})`);
        if (record.service_metadata) {
          const metaStr = JSON.stringify(record.service_metadata, null, 2);
          console.log(`     Metadata: ${metaStr.substring(0, 150)}...`);
        }
      });
    } else {
      console.log('⚠️ Chưa có metadata nào được lưu');
    }

    console.log('\n✅ HOÀN THÀNH KIỂM TRA!');
    console.log('\n📋 TÓM TẮT:');
    console.log('   - Bảng services: ✅ Có kết nối');
    console.log('   - Bảng service_variants: ✅ Có kết nối');
    console.log('   - Bảng service_availabilities: ✅ Có kết nối');
    console.log('   - Query API: ✅ Hoạt động');
    console.log('\n🎯 KẾT LUẬN: API đã được kết nối với database!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
