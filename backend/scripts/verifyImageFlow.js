// Comprehensive verification of image upload and display flow
const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    console.log('🔍 COMPREHENSIVE IMAGE FLOW VERIFICATION\n');
    console.log('=' .repeat(60));

    // Step 1: Check DB
    console.log('\n📊 STEP 1: Database Check');
    console.log('-'.repeat(60));
    
    const dbQuery = `
      SELECT 
        si.id,
        si.service_id,
        si.image_url,
        si.is_primary,
        si.sort_order,
        s.name as service_name,
        s.status
      FROM service_images si
      JOIN services s ON si.service_id = s.id
      WHERE s.status = 'ACTIVE'
      ORDER BY si.created_at DESC
    `;
    
    const dbResult = await pool.query(dbQuery);
    console.log(`Found ${dbResult.rows.length} images in DB for ACTIVE services:`);
    
    dbResult.rows.forEach((img, idx) => {
      console.log(`\n${idx + 1}. Service: ${img.service_name} (ID: ${img.service_id})`);
      console.log(`   Image URL: ${img.image_url}`);
      console.log(`   Primary: ${img.is_primary ? 'YES' : 'NO'}`);
      console.log(`   Sort Order: ${img.sort_order}`);
    });

    // Step 2: Check files
    console.log('\n\n📁 STEP 2: File System Check');
    console.log('-'.repeat(60));
    
    for (const img of dbResult.rows) {
      if (img.image_url && img.image_url.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), img.image_url.replace('/uploads/', 'uploads/'));
        const exists = fs.existsSync(filePath);
        const status = exists ? '✅ EXISTS' : '❌ NOT FOUND';
        console.log(`${status} - ${img.image_url}`);
        
        if (exists) {
          const stats = fs.statSync(filePath);
          console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        }
      }
    }

    // Step 3: Test API endpoint
    console.log('\n\n🌐 STEP 3: API Endpoint Test');
    console.log('-'.repeat(60));
    
    const apiQuery = `
      SELECT 
        s.id,
        s.name,
        s.status,
        (SELECT COUNT(*) FROM service_images WHERE service_id = s.id) as image_count
      FROM services s
      WHERE s.status = 'ACTIVE'
      ORDER BY s.created_at DESC
      LIMIT 5
    `;
    
    const apiResult = await pool.query(apiQuery);
    
    console.log('Testing what API will return for first 5 ACTIVE tours:\n');
    
    for (const tour of apiResult.rows) {
      const imagesQuery = `
        SELECT id, image_url, is_primary, sort_order 
        FROM service_images 
        WHERE service_id = $1 
        ORDER BY sort_order ASC, is_primary DESC
      `;
      const imagesResult = await pool.query(imagesQuery, [tour.id]);
      
      console.log(`Tour ID ${tour.id}: ${tour.name}`);
      console.log(`  Status: ${tour.status}`);
      console.log(`  Images in DB: ${tour.image_count}`);
      console.log(`  Images array:`, JSON.stringify(imagesResult.rows, null, 2));
      console.log('');
    }

    // Step 4: Expected frontend behavior
    console.log('\n📱 STEP 4: Expected Frontend Behavior');
    console.log('-'.repeat(60));
    
    console.log('\nFor Tour ID 12 (Đà Lạt - Nha Trang 4N3Đ):');
    const tour12Images = await pool.query(
      'SELECT * FROM service_images WHERE service_id = 12 ORDER BY sort_order ASC'
    );
    
    if (tour12Images.rows.length > 0) {
      const firstImage = tour12Images.rows[0];
      const expectedUrl = `http://localhost:5000${firstImage.image_url}`;
      console.log('✅ Has images in DB');
      console.log(`   First image URL: ${firstImage.image_url}`);
      console.log(`   Expected full URL: ${expectedUrl}`);
      console.log(`   Frontend should display: ${expectedUrl}`);
    } else {
      console.log('❌ No images found');
    }

    // Step 5: Recommendations
    console.log('\n\n💡 STEP 5: Recommendations');
    console.log('-'.repeat(60));
    
    console.log('\nTo see images on frontend:');
    console.log('1. ✅ Backend server must be running (port 5000)');
    console.log('2. ✅ Frontend must call /api/tours (not use fallback data)');
    console.log('3. ✅ TourCard must check tour.images array');
    console.log('4. ✅ Image URL must be constructed as: API_BASE_URL + image_url');
    console.log('5. ✅ Hard refresh browser (Ctrl+Shift+R) to clear cache');
    
    console.log('\n\nTest URLs:');
    console.log('- API list: http://localhost:5000/api/tours?limit=5');
    console.log('- API detail: http://localhost:5000/api/tours/12');
    console.log('- Image file: http://localhost:5000/uploads/tours/tour_12_1760153301889.png');
    console.log('- Frontend test: http://localhost:5173/#/test-images');
    console.log('- Frontend tours: http://localhost:5173/#/tours');

    console.log('\n' + '='.repeat(60));
    console.log('✅ VERIFICATION COMPLETE\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
