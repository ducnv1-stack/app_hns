const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const Tour = require('../models/Tour');

// GET /api/tours - Get all tours with filters
router.get('/', async (req, res) => {
  try {
    const { 
      country, 
      category, 
      minPrice, 
      maxPrice, 
      page = 1, 
      limit = 10,
      search 
    } = req.query;

    let whereConditions = ['s.status = $1'];
    let queryParams = ['ACTIVE'];
    let paramIndex = 2;

    // Build WHERE clause based on filters
    if (country) {
      whereConditions.push(`std.country = $${paramIndex}`);
      queryParams.push(country);
      paramIndex++;
    }

    if (category) {
      whereConditions.push(`s.service_type = $${paramIndex}`);
      queryParams.push(category.toUpperCase());
      paramIndex++;
    }

    if (minPrice) {
      whereConditions.push(`sv.price >= $${paramIndex}`);
      queryParams.push(parseInt(minPrice));
      paramIndex++;
    }

    if (maxPrice) {
      whereConditions.push(`sv.price <= $${paramIndex}`);
      queryParams.push(parseInt(maxPrice));
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(s.name ILIKE $${paramIndex} OR s.description ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const offset = (page - 1) * limit;
    queryParams.push(limit, offset);

    const toursQuery = `
      SELECT 
        s.id,
        s.name,
        s.slug,
        s.short_description,
        s.description,
        s.service_type,
        s.status,
        s.created_at,
        std.duration_days,
        std.country,
        std.min_participants,
        std.max_participants,
        std.itinerary,
        MIN(sv.price) as min_price,
        MAX(sv.price) as max_price,
        COUNT(DISTINCT si.id) as image_count,
        COUNT(DISTINCT sa.id) as availability_count
      FROM services s
      LEFT JOIN service_details_tour std ON s.id = std.service_id
      LEFT JOIN service_variants sv ON s.id = sv.service_id
      LEFT JOIN service_images si ON s.id = si.service_id
      LEFT JOIN service_availabilities sa ON s.id = sa.service_id
      WHERE ${whereConditions.join(' AND ')}
      GROUP BY s.id, std.duration_days, std.country, std.min_participants, std.max_participants, std.itinerary
      ORDER BY s.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT s.id) as total
      FROM services s
      LEFT JOIN service_details_tour std ON s.id = std.service_id
      LEFT JOIN service_variants sv ON s.id = sv.service_id
      WHERE ${whereConditions.join(' AND ')}
    `;

    const [toursResult, countResult] = await Promise.all([
      query(toursQuery, queryParams),
      query(countQuery, queryParams.slice(0, -2)) // Remove limit and offset for count
    ]);

    const tours = toursResult.rows;
    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    // Fetch images for each tour
    const toursWithImages = await Promise.all(
      tours.map(async (tour) => {
        const imagesQuery = `
          SELECT id, image_url, is_primary, sort_order 
          FROM service_images 
          WHERE service_id = $1 
          ORDER BY sort_order ASC, is_primary DESC
        `;
        const imagesResult = await query(imagesQuery, [tour.id]);
        return {
          ...tour,
          images: imagesResult.rows
        };
      })
    );

    res.json({
      success: true,
      data: {
        tours: toursWithImages,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tours'
    });
  }
});

// GET /api/tours/:slugOrId - Get tour by slug or ID
router.get('/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;

    // Get tour by slug or ID
    const tour = await Tour.findBySlugOrId(slugOrId);

    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    // Check if tour is active
    if (tour.status !== 'ACTIVE') {
      return res.status(404).json({
        success: false,
        error: 'Tour not available'
      });
    }

    // Get service variants (pricing)
    const variantsQuery = `
      SELECT * FROM service_variants
      WHERE service_id = $1 AND is_active = true
      ORDER BY price ASC
    `;
    const variantsResult = await query(variantsQuery, [tour.id]);

    // Get service images
    const imagesQuery = `
      SELECT * FROM service_images
      WHERE service_id = $1
      ORDER BY sort_order ASC, is_primary DESC
    `;
    const imagesResult = await query(imagesQuery, [tour.id]);

    // Get detailed service availabilities
    const availabilitiesQuery = `
      SELECT
        sa.*,
        sv.name as variant_name,
        sv.price as variant_price
      FROM service_availabilities sa
      LEFT JOIN service_variants sv ON sa.variant_id = sv.id
      WHERE sa.service_id = $1
      AND sa.start_datetime > NOW()
      ORDER BY sa.start_datetime ASC
      LIMIT 20
    `;
    const availabilitiesResult = await query(availabilitiesQuery, [tour.id]);

    // Format the response
    const tourData = {
      ...tour,
      variants: variantsResult.rows,
      images: imagesResult.rows,
      availabilities: availabilitiesResult.rows,
      pricing: {
        adult: variantsResult.rows[0]?.price || 0,
        child: Math.round((variantsResult.rows[0]?.price || 0) * 0.75),
        infant: 0
      }
    };

    res.json({
      success: true,
      data: tourData
    });

  } catch (error) {
    console.error('Error fetching tour:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tour'
    });
  }
});

// GET /api/tours/countries - Get available countries
router.get('/meta/countries', async (req, res) => {
  try {
    const countriesQuery = `
      SELECT DISTINCT std.country 
      FROM service_details_tour std
      JOIN services s ON std.service_id = s.id
      WHERE s.status = 'ACTIVE' AND std.country IS NOT NULL
      ORDER BY std.country ASC
    `;
    
    const result = await query(countriesQuery);
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        key: row.country,
        name: row.country === 'vietnam' ? 'Việt Nam' : 
              row.country === 'china' ? 'Trung Quốc' : row.country
      }))
    });

  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch countries'
    });
  }
});

// GET /api/tours/categories - Get available categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categoriesQuery = `
      SELECT DISTINCT s.service_type 
      FROM services s
      WHERE s.status = 'ACTIVE'
      ORDER BY s.service_type ASC
    `;
    
    const result = await query(categoriesQuery);
    
    const categoryMap = {
      'TOUR': 'Tour du lịch',
      'HOTEL': 'Khách sạn',
      'FLIGHT': 'Vé máy bay',
      'COMBO': 'Combo'
    };
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        key: row.service_type,
        name: categoryMap[row.service_type] || row.service_type
      }))
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

module.exports = router;
