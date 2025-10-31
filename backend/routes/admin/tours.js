const express = require('express');
const router = express.Router();
const Tour = require('../../models/Tour');
const { authenticate, authorize } = require('../../middleware/auth');
const {
  validateTourCreate,
  validateTourUpdate,
  validateTourFilters,
  validateBulkUpdate,
  formatValidationErrors
} = require('../../utils/tourValidation');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query, getClient } = require('../../config/database-supabase');

// Apply admin authentication and authorization to all routes
router.use(authenticate);
router.use(authorize(['admin']));

// Multer storage for tour images
const uploadDir = path.join(process.cwd(), 'uploads', 'tours');
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = `tour_${req.params.id || 'unknown'}_${Date.now()}${ext}`;
    cb(null, base);
  }
});
const upload = multer({ storage });

// GET /api/admin/tours - Get all tours with filters
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Admin: Fetching tours with filters:', req.query);

    // Validate query parameters
    const { error, value: filters } = validateTourFilters(req.query);
    if (error) {
      console.error('❌ Validation error:', error.details);
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: formatValidationErrors(error)
      });
    }

    console.log('✅ Validated filters:', filters);
    const result = await Tour.findAll(filters);
    console.log('✅ Query result:', { tourCount: result.tours.length, pagination: result.pagination });
    
    res.json({
      success: true,
      data: result.tours,
      pagination: result.pagination,
      message: 'Tours fetched successfully'
    });

  } catch (error) {
    console.error('❌ Error fetching tours:', error.message);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tours',
      details: String(error.message || error)
    });
  }
});

// GET /api/admin/tours/stats - Get tour statistics
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 Admin: Fetching tour statistics');

    const stats = await Tour.getStats();
    
    res.json({
      success: true,
      data: stats,
      message: 'Tour statistics fetched successfully'
    });

  } catch (error) {
    console.error('Error fetching tour stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tour statistics'
    });
  }
});

// GET /api/admin/tours/popular - Get popular tours
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    console.log('🔥 Admin: Fetching popular tours, limit:', limit);

    const tours = await Tour.getPopular(parseInt(limit));
    
    res.json({
      success: true,
      data: tours,
      message: 'Popular tours fetched successfully'
    });

  } catch (error) {
    console.error('Error fetching popular tours:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch popular tours'
    });
  }
});

// GET /api/admin/tours/:id - Get tour by ID
router.get('/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    
    console.log('🔍 Admin: Fetching tour by slug or ID:', slugOrId);

    if (!slugOrId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tour identifier'
      });
    }

    const tour = await Tour.findBySlugOrId(slugOrId);
    
    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    res.json({
      success: true,
      data: tour,
      message: 'Tour fetched successfully'
    });

  } catch (error) {
    console.error('Error fetching tour:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tour'
    });
  }
});

// GET /api/admin/tours/:slugOrId/content - Full editable content
router.get('/:slugOrId/content', async (req, res) => {
  try {
    const { slugOrId } = req.params;

    // Get tour by slug or ID
    const tour = await Tour.findBySlugOrId(slugOrId);
    
    if (!tour) {
      return res.status(404).json({ success: false, error: 'Tour not found' });
    }

    const service = tour;
    const serviceType = service.service_type;

    // Get type-specific details based on service_type
    let typeDetails = null;
    if (serviceType === 'TOUR') {
      const tourQuery = `SELECT * FROM service_details_tour WHERE service_id = $1`;
      const tourRes = await query(tourQuery, [tour.id]);
      typeDetails = tourRes.rows[0] || null;
    } else if (serviceType === 'FLIGHT') {
      const flightQuery = `SELECT * FROM service_details_flight WHERE service_id = $1`;
      const flightRes = await query(flightQuery, [tour.id]);
      typeDetails = flightRes.rows[0] || null;
    } else if (serviceType === 'HOTEL') {
      const hotelQuery = `SELECT * FROM service_details_hotel WHERE service_id = $1`;
      const hotelRes = await query(hotelQuery, [tour.id]);
      typeDetails = hotelRes.rows[0] || null;
    } else if (serviceType === 'COMBO') {
      const comboQuery = `SELECT * FROM service_details_combo WHERE service_id = $1`;
      const comboRes = await query(comboQuery, [tour.id]);
      typeDetails = comboRes.rows[0] || null;
    }

    // Get common data
    const variantsQuery = `SELECT * FROM service_variants WHERE service_id = $1 ORDER BY price ASC`;
    const imagesQuery = `SELECT * FROM service_images WHERE service_id = $1 ORDER BY sort_order ASC, is_primary DESC`;
    const availabilitiesQuery = `
      SELECT * FROM service_availabilities
      WHERE service_id = $1 AND start_datetime > NOW() - INTERVAL '1 day'
      ORDER BY start_datetime ASC
      LIMIT 100
    `;

    const [variantsRes, imagesRes, avaiRes] = await Promise.all([
      query(variantsQuery, [tour.id]),
      query(imagesQuery, [tour.id]),
      query(availabilitiesQuery, [tour.id])
    ]);

    res.json({
      success: true,
      data: {
        ...service,
        type_details: typeDetails,
        variants: variantsRes.rows,
        images: imagesRes.rows,
        availabilities: avaiRes.rows
      }
    });
  } catch (error) {
    console.error('❌ Error fetching admin tour content:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch tour content', details: String(error.message || error) });
  }
});

// PUT /api/admin/tours/:id/basic - Update basic info and detail fields
router.put('/:id/basic', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    short_description,
    description,
    service_type,
    status,
    default_currency,
    base_price,
    duration_days,
    country,
    min_participants,
    max_participants,
    location
  } = req.body;

  const client = await getClient();
  try {
    await client.query('BEGIN');

    const updates = [];
    const values = [];
    let i = 1;
    const add = (col, val) => { updates.push(`${col} = $${i}`); values.push(val); i++; };
    if (name !== undefined) add('name', name);
    if (short_description !== undefined) add('short_description', short_description);
    if (description !== undefined) add('description', description);
    if (service_type !== undefined) add('service_type', service_type);
    if (status !== undefined) add('status', status);
    if (default_currency !== undefined) add('default_currency', default_currency);
    if (base_price !== undefined) add('base_price', base_price);
    if (updates.length) {
      values.push(id);
      await client.query(`UPDATE services SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${i}` , values);
    }

    await client.query(`INSERT INTO service_details_tour (service_id) VALUES ($1) ON CONFLICT (service_id) DO NOTHING`, [id]);

    const dUpdates = [];
    const dValues = [];
    i = 1;
    const addD = (col, val) => { dUpdates.push(`${col} = $${i}`); dValues.push(val); i++; };
    if (duration_days !== undefined) addD('duration_days', duration_days);
    if (country !== undefined) addD('country', country);
    if (min_participants !== undefined) addD('min_participants', min_participants);
    if (max_participants !== undefined) addD('max_participants', max_participants);
    if (dUpdates.length) {
      dValues.push(id);
      await client.query(`UPDATE service_details_tour SET ${dUpdates.join(', ')} WHERE service_id = $${i}`, dValues);
    }

    // Update location into services.metadata JSONB (non-breaking)
    if (location !== undefined) {
      await client.query(
        `UPDATE services SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('location', $1), updated_at = NOW() WHERE id = $2`,
        [location, id]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Tour basic info updated' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to update tour basic:', error);
    res.status(500).json({ success: false, error: 'Failed to update tour basic', details: String(error.message || error) });
  } finally {
    client.release();
  }
});

// PUT /api/admin/tours/:id/type-details - Update type-specific details
router.put('/:id/type-details', async (req, res) => {
  const client = await getClient();
  try {
    const { id } = req.params;
    const { service_type, details } = req.body;

    await client.query('BEGIN');

    if (service_type === 'TOUR') {
      const { duration_days, country, min_participants, max_participants, itinerary } = details;
      await client.query(
        `INSERT INTO service_details_tour (service_id, duration_days, country, min_participants, max_participants, itinerary)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (service_id) DO UPDATE SET
           duration_days = EXCLUDED.duration_days,
           country = EXCLUDED.country,
           min_participants = EXCLUDED.min_participants,
           max_participants = EXCLUDED.max_participants,
           itinerary = EXCLUDED.itinerary,
           updated_at = NOW()`,
        [id, duration_days, country, min_participants, max_participants, typeof itinerary === 'string' ? itinerary : JSON.stringify(itinerary || [])]
      );
    } else if (service_type === 'FLIGHT') {
      const { airline, flight_number, departure_airport, arrival_airport, departure_time, arrival_time, aircraft_type, baggage_allowance, seat_class } = details;
      await client.query(
        `INSERT INTO service_details_flight (service_id, airline, flight_number, departure_airport, arrival_airport, departure_time, arrival_time, aircraft_type, baggage_allowance, seat_class)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (service_id) DO UPDATE SET
           airline = EXCLUDED.airline,
           flight_number = EXCLUDED.flight_number,
           departure_airport = EXCLUDED.departure_airport,
           arrival_airport = EXCLUDED.arrival_airport,
           departure_time = EXCLUDED.departure_time,
           arrival_time = EXCLUDED.arrival_time,
           aircraft_type = EXCLUDED.aircraft_type,
           baggage_allowance = EXCLUDED.baggage_allowance,
           seat_class = EXCLUDED.seat_class,
           updated_at = NOW()`,
        [id, airline, flight_number, departure_airport, arrival_airport, departure_time, arrival_time, aircraft_type, baggage_allowance, seat_class]
      );
    } else if (service_type === 'HOTEL') {
      const { hotel_name, hotel_address, star_rating, room_type, bed_type, room_size, max_occupancy, amenities, check_in_time, check_out_time, cancellation_policy } = details;
      await client.query(
        `INSERT INTO service_details_hotel (service_id, hotel_name, hotel_address, star_rating, room_type, bed_type, room_size, max_occupancy, amenities, check_in_time, check_out_time, cancellation_policy)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (service_id) DO UPDATE SET
           hotel_name = EXCLUDED.hotel_name,
           hotel_address = EXCLUDED.hotel_address,
           star_rating = EXCLUDED.star_rating,
           room_type = EXCLUDED.room_type,
           bed_type = EXCLUDED.bed_type,
           room_size = EXCLUDED.room_size,
           max_occupancy = EXCLUDED.max_occupancy,
           amenities = EXCLUDED.amenities,
           check_in_time = EXCLUDED.check_in_time,
           check_out_time = EXCLUDED.check_out_time,
           cancellation_policy = EXCLUDED.cancellation_policy,
           updated_at = NOW()`,
        [id, hotel_name, hotel_address, star_rating, room_type, bed_type, room_size, max_occupancy, JSON.stringify(amenities || []), check_in_time, check_out_time, cancellation_policy]
      );
    } else if (service_type === 'COMBO') {
      const { includes_tour, includes_hotel, includes_flight, combo_description, special_offers } = details;
      await client.query(
        `INSERT INTO service_details_combo (service_id, includes_tour, includes_hotel, includes_flight, combo_description, special_offers)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (service_id) DO UPDATE SET
           includes_tour = EXCLUDED.includes_tour,
           includes_hotel = EXCLUDED.includes_hotel,
           includes_flight = EXCLUDED.includes_flight,
           combo_description = EXCLUDED.combo_description,
           special_offers = EXCLUDED.special_offers,
           updated_at = NOW()`,
        [id, includes_tour, includes_hotel, includes_flight, combo_description, special_offers]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Type-specific details updated' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to update type details:', error);
    res.status(500).json({ success: false, error: 'Failed to update type details', details: String(error.message || error) });
  } finally {
    client.release();
  }
});

// PUT /api/admin/tours/:id/itinerary - Update itinerary JSON or text
router.put('/:id/itinerary', async (req, res) => {
  try {
    const { id } = req.params;
    const { itinerary } = req.body;
    await query(
      `INSERT INTO service_details_tour (service_id, itinerary) VALUES ($1, $2)
       ON CONFLICT (service_id) DO UPDATE SET itinerary = EXCLUDED.itinerary`,
      [id, typeof itinerary === 'string' ? itinerary : JSON.stringify(itinerary || [])]
    );
    res.json({ success: true, message: 'Itinerary updated' });
  } catch (error) {
    console.error('❌ Failed to update itinerary:', error);
    res.status(500).json({ success: false, error: 'Failed to update itinerary', details: String(error.message || error) });
  }
});

// POST /api/admin/tours/:id/images - Upload images for a tour
router.post('/:id/images', upload.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ success: false, error: 'No files uploaded' });

    const currentMax = await query('SELECT COALESCE(MAX(sort_order), 0) AS max FROM service_images WHERE service_id = $1', [id]);
    let next = parseInt(currentMax.rows[0].max || 0) + 1;
    const inserted = [];
    for (const f of files) {
      const imageUrl = `/uploads/tours/${f.filename}`.replace(/\\/g, '/');
      const ins = await query(
        `INSERT INTO service_images (service_id, image_url, is_primary, sort_order) VALUES ($1, $2, false, $3) RETURNING *`,
        [id, imageUrl, next++]
      );
      inserted.push(ins.rows[0]);
    }
    res.status(201).json({ success: true, data: inserted, message: 'Images uploaded' });
  } catch (error) {
    console.error('❌ Failed to upload images:', error);
    res.status(500).json({ success: false, error: 'Failed to upload images', details: String(error.message || error) });
  }
});

// DELETE /api/admin/tours/:id/images/:imageId - Delete image
router.delete('/:id/images/:imageId', async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const del = await query('DELETE FROM service_images WHERE id = $1 AND service_id = $2 RETURNING *', [imageId, id]);
    if (del.rows.length === 0) return res.status(404).json({ success: false, error: 'Image not found' });
    const removed = del.rows[0];
    if (removed.image_url) {
      const filePath = require('path').join(process.cwd(), removed.image_url.replace('/uploads/', 'uploads/'));
      require('fs').promises.unlink(filePath).catch(() => {});
    }
    res.json({ success: true, data: removed, message: 'Image deleted' });
  } catch (error) {
    console.error('❌ Failed to delete image:', error);
    res.status(500).json({ success: false, error: 'Failed to delete image', details: String(error.message || error) });
  }
});

// POST /api/admin/tours - Create new tour
router.post('/', async (req, res) => {
  try {
    console.log('➕ Admin: Creating new tour:', req.body);

    // Validate request body
    const { error, value: tourData } = validateTourCreate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tour data',
        details: formatValidationErrors(error)
      });
    }

    const tour = await Tour.create(tourData);
    
    res.status(201).json({
      success: true,
      data: tour,
      message: 'Tour created successfully'
    });

  } catch (error) {
    console.error('Error creating tour:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create tour'
    });
  }
});

// PUT /api/admin/tours/:slugOrId - Update tour
router.put('/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    
    console.log('✏️ Admin: Updating tour:', slugOrId, req.body);

    if (!slugOrId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tour identifier'
      });
    }

    // Get tour by slug or ID to get the actual ID
    const existingTour = await Tour.findBySlugOrId(slugOrId);
    if (!existingTour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    const id = existingTour.id;

    // Validate request body
    const { error, value: updateData } = validateTourUpdate(req.body);
    if (error) {
      console.error('❌ Validation error:', error.details);
      console.error('📦 Request body:', JSON.stringify(req.body, null, 2));
      return res.status(400).json({
        success: false,
        error: 'Invalid update data',
        details: formatValidationErrors(error)
      });
    }

    // Enforce description length when resulting status is ACTIVE
    const current = await Tour.findById(parseInt(id));
    if (!current) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    const nextStatus = updateData.status || current.status;
    const nextDescription = updateData.description !== undefined
      ? String(updateData.description)
      : String(current.description || '');

    if (String(nextStatus).toUpperCase() === 'ACTIVE') {
      if (!nextDescription || nextDescription.trim().length < 10) {
        return res.status(400).json({
          success: false,
          error: 'Invalid update data',
          details: [{
            field: 'description',
            message: 'Description must be at least 10 characters when status is ACTIVE',
            value: nextDescription
          }]
        });
      }
    }

    const tour = await Tour.update(parseInt(id), updateData);
    
    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    res.json({
      success: true,
      data: tour,
      message: 'Tour updated successfully'
    });

  } catch (error) {
    console.error('Error updating tour:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update tour'
    });
  }
});

// DELETE /api/admin/tours/:id - Delete tour (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Admin: Deleting tour:', id);

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tour ID'
      });
    }

    const tour = await Tour.delete(parseInt(id));
    
    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    res.json({
      success: true,
      data: tour,
      message: 'Tour deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting tour:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete tour'
    });
  }
});

// DELETE /api/admin/tours/:id/hard - Hard delete tour
router.delete('/:id/hard', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('💀 Admin: Hard deleting tour:', id);

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tour ID'
      });
    }

    const tour = await Tour.hardDelete(parseInt(id));
    
    if (!tour) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    res.json({
      success: true,
      data: tour,
      message: 'Tour permanently deleted'
    });

  } catch (error) {
    console.error('Error hard deleting tour:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to permanently delete tour'
    });
  }
});

// PATCH /api/admin/tours/bulk - Bulk update tours
router.patch('/bulk', async (req, res) => {
  try {
    console.log('📦 Admin: Bulk updating tours:', req.body);

    // Validate request body
    const { error, value: bulkData } = validateBulkUpdate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid bulk update data',
        details: formatValidationErrors(error)
      });
    }

    const { tourIds, updates } = bulkData;
    const updatedTours = await Tour.bulkUpdate(tourIds, updates);
    
    res.json({
      success: true,
      data: updatedTours,
      message: `${updatedTours.length} tours updated successfully`
    });

  } catch (error) {
    console.error('Error bulk updating tours:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk update tours'
    });
  }
});

module.exports = router;
