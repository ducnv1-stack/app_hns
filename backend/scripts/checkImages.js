// Check service_images table
const { pool } = require('../config/database');

(async () => {
  try {
    console.log('🔍 Checking service_images table...\n');

    // Get all images
    const imagesQuery = `
      SELECT 
        si.id,
        si.service_id,
        si.image_url,
        si.is_primary,
        si.sort_order,
        si.created_at,
        s.name as service_name
      FROM service_images si
      LEFT JOIN services s ON si.service_id = s.id
      ORDER BY si.created_at DESC
      LIMIT 10
    `;
    
    const result = await pool.query(imagesQuery);
    
    console.log(`📊 Found ${result.rows.length} images:\n`);
    
    result.rows.forEach((img, idx) => {
      console.log(`${idx + 1}. Image ID: ${img.id}`);
      console.log(`   Service: ${img.service_name} (ID: ${img.service_id})`);
      console.log(`   URL: ${img.image_url}`);
      console.log(`   Primary: ${img.is_primary ? 'YES' : 'NO'}`);
      console.log(`   Sort Order: ${img.sort_order}`);
      console.log(`   Created: ${img.created_at}`);
      console.log('');
    });

    // Check if files exist
    const fs = require('fs');
    const path = require('path');
    
    console.log('\n🔍 Checking if image files exist on disk:\n');
    
    for (const img of result.rows) {
      if (img.image_url && img.image_url.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), img.image_url.replace('/uploads/', 'uploads/'));
        const exists = fs.existsSync(filePath);
        console.log(`${exists ? '✅' : '❌'} ${img.image_url} ${exists ? 'EXISTS' : 'NOT FOUND'}`);
      }
    }

    // Test API endpoint
    console.log('\n🔍 Testing /api/tours endpoint response:\n');
    
    const toursQuery = `
      SELECT 
        s.id,
        s.name,
        (SELECT json_agg(json_build_object(
          'id', si.id,
          'image_url', si.image_url,
          'is_primary', si.is_primary,
          'sort_order', si.sort_order
        ) ORDER BY si.sort_order ASC, si.is_primary DESC)
        FROM service_images si
        WHERE si.service_id = s.id) as images
      FROM services s
      WHERE s.status = 'ACTIVE'
      LIMIT 3
    `;
    
    const toursResult = await pool.query(toursQuery);
    
    toursResult.rows.forEach((tour, idx) => {
      console.log(`${idx + 1}. Tour: ${tour.name} (ID: ${tour.id})`);
      console.log(`   Images array:`, JSON.stringify(tour.images, null, 2));
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
