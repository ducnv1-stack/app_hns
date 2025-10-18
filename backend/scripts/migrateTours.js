const { query } = require('../config/database');
const tours = require('../../app_hns/HaNoiSun-main/src/data/tours.js').tours;

async function migrateTours() {
  console.log('🚀 Starting tours migration...');
  
  try {
    // 1. Create a sample provider first
    console.log('📋 Creating sample provider...');
    const providerResult = await query(`
      INSERT INTO providers (name, provider_type, contact_name, contact_phone, email)
      VALUES ('Hà Nội Sun Travel', 'TOUR_OPERATOR', 'HNS Team', '0123456789', 'info@hanoisun.com')
      RETURNING id
    `);
    const providerId = providerResult.rows[0].id;
    console.log(`✅ Provider created with ID: ${providerId}`);

    // 2. Migrate each tour
    for (let i = 0; i < tours.length; i++) {
      const tour = tours[i];
      console.log(`\n📦 Migrating tour ${i + 1}/${tours.length}: ${tour.title}`);

      // Create service
      const serviceResult = await query(`
        INSERT INTO services (
          provider_id, service_type, name, slug, short_description, 
          description, status, default_currency, metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `, [
        providerId,
        'TOUR',
        tour.title,
        tour.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        tour.description,
        tour.introduction || tour.description,
        'ACTIVE',
        'VND',
        JSON.stringify({
          originalId: tour.id,
          rating: tour.rating,
          reviews: tour.reviews,
          isPopular: tour.isPopular,
          isOnSale: tour.isOnSale,
          discount: tour.discount,
          highlights: tour.highlights
        })
      ]);

      const serviceId = serviceResult.rows[0].id;

      // Create service_details_tour
      await query(`
        INSERT INTO service_details_tour (
          service_id, duration_days, country, itinerary, 
          min_participants, max_participants
        )
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        serviceId,
        parseInt(tour.duration) || null,
        tour.country,
        JSON.stringify(tour.itinerary || []),
        tour.groupSize ? parseInt(tour.groupSize.split('-')[0]) : null,
        tour.groupSize ? parseInt(tour.groupSize.split('-')[1]) : null
      ]);

      // Create service variants (pricing)
      if (tour.pricing) {
        await query(`
          INSERT INTO service_variants (service_id, name, price, currency, is_active)
          VALUES ($1, $2, $3, $4, true)
        `, [
          serviceId,
          'Standard',
          tour.pricing.adult,
          'VND'
        ]);
      }

      // Create service images
      if (tour.image) {
        await query(`
          INSERT INTO service_images (service_id, image_url, is_primary, sort_order)
          VALUES ($1, $2, true, 0)
        `, [serviceId, tour.image]);
      }

      // Create additional images from gallery
      if (tour.gallery) {
        for (let j = 0; j < tour.gallery.length; j++) {
          await query(`
            INSERT INTO service_images (service_id, image_url, is_primary, sort_order)
            VALUES ($1, $2, false, $3)
          `, [serviceId, tour.gallery[j], j + 1]);
        }
      }

      // Create service availabilities from schedules
      if (tour.schedules) {
        for (const schedule of tour.schedules) {
          for (const option of schedule.options) {
            // Parse date from range (e.g., "26/10-29/10" -> "2025-10-26")
            const dateMatch = option.range.match(/(\d{1,2})\/(\d{1,2})/);
            if (dateMatch) {
              const day = dateMatch[1].padStart(2, '0');
              const month = dateMatch[2].padStart(2, '0');
              const startDate = `2025-${month}-${day}`;
              
              // Calculate end date based on duration
              const duration = parseInt(tour.duration) || 3;
              const endDate = new Date(startDate);
              endDate.setDate(endDate.getDate() + duration - 1);

              await query(`
                INSERT INTO service_availabilities (
                  service_id, start_datetime, end_datetime, 
                  total_capacity, booked_capacity, price, currency, status
                )
                VALUES ($1, $2, $3, $4, 0, $5, 'VND', 'AVAILABLE')
              `, [
                serviceId,
                `${startDate} 08:00:00`,
                `${endDate.toISOString().split('T')[0]} 18:00:00`,
                20, // Default capacity
                option.price
              ]);
            }
          }
        }
      } else if (tour.availableDates) {
        // Create availabilities from availableDates
        for (const dateStr of tour.availableDates) {
          const startDate = new Date(dateStr);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + (parseInt(tour.duration) || 3) - 1);

          await query(`
            INSERT INTO service_availabilities (
              service_id, start_datetime, end_datetime, 
              total_capacity, booked_capacity, price, currency, status
            )
            VALUES ($1, $2, $3, $4, 0, $5, 'VND', 'AVAILABLE')
          `, [
            serviceId,
            `${dateStr} 08:00:00`,
            `${endDate.toISOString().split('T')[0]} 18:00:00`,
            20,
            tour.price
          ]);
        }
      }

      console.log(`✅ Tour migrated: ${tour.title}`);
    }

    console.log('\n🎉 All tours migrated successfully!');
    
    // Show summary
    const summaryResult = await query(`
      SELECT 
        COUNT(*) as total_services,
        COUNT(DISTINCT sv.id) as total_variants,
        COUNT(DISTINCT si.id) as total_images,
        COUNT(DISTINCT sa.id) as total_availabilities
      FROM services s
      LEFT JOIN service_variants sv ON s.id = sv.service_id
      LEFT JOIN service_images si ON s.id = si.service_id
      LEFT JOIN service_availabilities sa ON s.id = sa.service_id
      WHERE s.service_type = 'TOUR'
    `);

    const summary = summaryResult.rows[0];
    console.log('\n📊 Migration Summary:');
    console.log(`- Services: ${summary.total_services}`);
    console.log(`- Variants: ${summary.total_variants}`);
    console.log(`- Images: ${summary.total_images}`);
    console.log(`- Availabilities: ${summary.total_availabilities}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateTours()
    .then(() => {
      console.log('✅ Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateTours };
