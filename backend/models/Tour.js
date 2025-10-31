const { pool } = require('../config/database-supabase');
const { generateSlug, generateUniqueSlug, isValidSlug, extractIdFromSlug } = require('../utils/slugGenerator');

class Tour {
  // Get all tours with pagination and filters
  static async findAll(filters = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '', // maps to services.service_type
      status = '',   // maps to services.status (ACTIVE/INACTIVE/DRAFT)
      minPrice = '',
      maxPrice = '',
      country = ''
    } = filters;

    let whereConditions = ['1=1'];
    let queryParams = [];
    let paramIndex = 1;

    // Search by name or description
    if (search) {
      whereConditions.push(`(s.name ILIKE $${paramIndex} OR s.description ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Filter by category (service type)
    if (category) {
      whereConditions.push(`s.service_type = $${paramIndex}`);
      queryParams.push(category.toUpperCase());
      paramIndex++;
    }

    // Filter by status
    if (status && String(status).toLowerCase() !== 'all') {
      const statusMap = {
        active: 'ACTIVE',
        inactive: 'INACTIVE',
        draft: 'DRAFT'
      };
      whereConditions.push(`s.status = $${paramIndex}`);
      queryParams.push(statusMap[String(status).toLowerCase()] || String(status).toUpperCase());
      paramIndex++;
    }

    // Filter by country (from service_details_tour)
    if (country) {
      whereConditions.push(`std.country = $${paramIndex}`);
      queryParams.push(country);
      paramIndex++;
    }

    // Filter by price range (from service_variants)
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

    const safeLimit = parseInt(limit);
    const safePage = parseInt(page);
    const offset = (safePage - 1) * safeLimit;
    queryParams.push(safeLimit, offset);

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
        s.updated_at,
        std.duration_days,
        std.country,
        std.min_participants,
        std.max_participants,
        MIN(sv.price) AS min_price,
        MAX(sv.price) AS max_price
      FROM services s
      LEFT JOIN service_details_tour std ON s.id = std.service_id
      LEFT JOIN service_variants sv ON s.id = sv.service_id
      WHERE ${whereConditions.join(' AND ')}
      GROUP BY s.id, std.duration_days, std.country, std.min_participants, std.max_participants
      ORDER BY s.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT s.id) AS total
      FROM services s
      LEFT JOIN service_details_tour std ON s.id = std.service_id
      LEFT JOIN service_variants sv ON s.id = sv.service_id
      WHERE ${whereConditions.join(' AND ')}
    `;

    try {
      const [toursResult, countResult] = await Promise.all([
        pool.query(toursQuery, queryParams),
        pool.query(countQuery, queryParams.slice(0, -2))
      ]);

      return {
        tours: toursResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].total || 0),
          pages: Math.ceil((countResult.rows[0].total || 0) / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching tours (admin model):', error);
      throw error;
    }
  }

  // Get tour by ID
  static async findById(tourId) {
    // Avoid referencing non-existent optional tables like 'reviews'
    const query = `
      SELECT 
        s.*, 
        (s.metadata->>'location') AS location,
        COUNT(bi.id) AS booking_count,
        0::decimal AS avg_rating,
        0::bigint AS review_count
      FROM services s
      LEFT JOIN booking_items bi ON s.id = bi.service_id
      WHERE s.id = $1
      GROUP BY s.id
    `;

    try {
      const result = await pool.query(query, [tourId]);
      const row = result.rows[0];
      if (!row) return null;
      const mergedMetadata = row.metadata && typeof row.metadata === 'object' ? { ...row.metadata } : {};
      if (row.location !== undefined && row.location !== null) {
        mergedMetadata.location = row.location;
      }
      return { ...row, metadata: mergedMetadata };
    } catch (error) {
      console.error('Error fetching tour by ID:', error);
      throw error;
    }
  }

  // Get tour by slug
  static async findBySlug(slug) {
    const query = `
      SELECT 
        s.*, 
        (s.metadata->>'location') AS location,
        COUNT(bi.id) AS booking_count,
        0::decimal AS avg_rating,
        0::bigint AS review_count
      FROM services s
      LEFT JOIN booking_items bi ON s.id = bi.service_id
      WHERE s.slug = $1
      GROUP BY s.id
    `;

    try {
      const result = await pool.query(query, [slug]);
      const row = result.rows[0];
      if (!row) return null;
      const mergedMetadata = row.metadata && typeof row.metadata === 'object' ? { ...row.metadata } : {};
      if (row.location !== undefined && row.location !== null) {
        mergedMetadata.location = row.location;
      }
      return { ...row, metadata: mergedMetadata };
    } catch (error) {
      console.error('Error fetching tour by slug:', error);
      throw error;
    }
  }

  // Get tour by slug or ID (fallback support)
  static async findBySlugOrId(identifier) {
    const isNumeric = /^\d+$/.test(identifier);
    
    if (isNumeric) {
      // If it's a number, treat as ID (fallback)
      return await this.findById(identifier);
    } else {
      // If it's a string, treat as slug
      return await this.findBySlug(identifier);
    }
  }

  // Create new tour with multi-table support
  static async create(tourData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // 1. Insert into services (main table)
      const {
        name,
        short_description,
        description,
        service_type = 'TOUR',
        status = 'DRAFT',
        // Tour fields
        duration_days,
        country,
        min_participants,
        max_participants,
        itinerary,
        // Hotel fields
        hotel_name,
        hotel_address,
        star_rating,
        room_types,
        bed_types,
        room_area,
        max_occupancy,
        check_in_time,
        check_out_time,
        amenities,
        // Flight fields
        airline,
        flight_number,
        departure_airport,
        arrival_airport,
        departure_time,
        arrival_time,
        aircraft_type,
        baggage_allowance,
        cabin_class
      } = tourData;

      const serviceQuery = `
        INSERT INTO services (
          name, short_description, description, service_type, status
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const serviceResult = await client.query(serviceQuery, [
        name, short_description, description, service_type, status
      ]);
      
      const serviceId = serviceResult.rows[0].id;
      console.log('✅ Created service with ID:', serviceId);

      // Generate and set slug
      const slug = await generateUniqueSlug(name, serviceId, client);
      await client.query(
        'UPDATE services SET slug = $1 WHERE id = $2',
        [slug, serviceId]
      );
      console.log('✅ Generated slug:', slug);

      // 2. Insert into service_details_tour (if tour data exists)
      if (duration_days || country || itinerary) {
        const tourQuery = `
          INSERT INTO service_details_tour (
            service_id, duration_days, country, min_participants, max_participants,
            itinerary
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `;
        
        await client.query(tourQuery, [
          serviceId,
          duration_days || null,
          country || null,
          min_participants || null,
          max_participants || null,
          itinerary ? JSON.stringify(itinerary) : null
        ]);
        console.log('✅ Created tour details');
      }

      // 3. Insert into service_details_hotel (if hotel data exists)
      if (hotel_name || star_rating) {
        const hotelQuery = `
          INSERT INTO service_details_hotel (
            service_id, hotel_name, hotel_address, star_rating, room_type,
            bed_type, room_size, max_occupancy, amenities, check_in_time, check_out_time
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `;
        
        await client.query(hotelQuery, [
          serviceId,
          hotel_name || null,
          hotel_address || null,
          star_rating || null,
          room_types || null,
          bed_types || null,
          room_area ? parseFloat(room_area) : null,
          max_occupancy || null,
          amenities ? JSON.stringify(amenities) : null,
          check_in_time || null,
          check_out_time || null
        ]);
        console.log('✅ Created hotel details');
      }

      // 4. Insert into service_details_flight (if flight data exists)
      if (airline || flight_number) {
        const flightQuery = `
          INSERT INTO service_details_flight (
            service_id, airline, flight_number, departure_airport, arrival_airport,
            departure_time, arrival_time, aircraft_type, baggage_allowance, seat_class
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        
        await client.query(flightQuery, [
          serviceId,
          airline || null,
          flight_number || null,
          departure_airport || null,
          arrival_airport || null,
          departure_time || null,
          arrival_time || null,
          aircraft_type || null,
          baggage_allowance || null,
          cabin_class || null
        ]);
        console.log('✅ Created flight details');
      }

      await client.query('COMMIT');
      console.log('✅ Transaction committed successfully');
      
      return serviceResult.rows[0];
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error creating service, rolling back:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Update tour with multi-table support
  static async update(tourId, updateData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // 1. Update services table (note: no base_price column in services)
      const serviceFields = ['name', 'short_description', 'description', 'service_type', 'status', 'default_currency'];
      const serviceUpdates = [];
      const serviceValues = [];
      let paramIndex = 1;

      serviceFields.forEach(field => {
        if (updateData[field] !== undefined) {
          serviceUpdates.push(`${field} = $${paramIndex}`);
          serviceValues.push(updateData[field]);
          paramIndex++;
        }
      });

      if (serviceUpdates.length > 0) {
        serviceUpdates.push(`updated_at = CURRENT_TIMESTAMP`);
        serviceValues.push(tourId);
        
        const serviceQuery = `
          UPDATE services 
          SET ${serviceUpdates.join(', ')}
          WHERE id = $${paramIndex}
          RETURNING *
        `;
        
        await client.query(serviceQuery, serviceValues);
        console.log('✅ Updated service');
      }

      // Update location into services.metadata JSONB if provided
      if (updateData.location !== undefined) {
        await client.query(
          `UPDATE services 
           SET metadata = COALESCE(metadata, '{}'::jsonb) 
             || jsonb_build_object('location', $1::text),
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $2`,
          [updateData.location, tourId]
        );
        console.log('✅ Updated service metadata.location');
      }

      // Update slug if name changed
      if (updateData.name !== undefined) {
        const newSlug = await generateUniqueSlug(updateData.name, tourId, client);
        await client.query(
          'UPDATE services SET slug = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [newSlug, tourId]
        );
        console.log('✅ Updated service slug:', newSlug);
      }

      // 2. Update/Insert tour details
      const tourFields = ['duration_days', 'country', 'min_participants', 'max_participants', 'itinerary'];
      const hasTourData = tourFields.some(field => updateData[field] !== undefined);
      
      if (hasTourData) {
        // Check if tour details exist
        const checkTour = await client.query(
          'SELECT service_id FROM service_details_tour WHERE service_id = $1',
          [tourId]
        );
        
        if (checkTour.rows.length > 0) {
          // Update existing
          const tourUpdates = [];
          const tourValues = [];
          let idx = 1;
          
          tourFields.forEach(field => {
            if (updateData[field] !== undefined) {
              tourUpdates.push(`${field} = $${idx}`);
              let value = updateData[field];
              if (field === 'itinerary') {
                value = typeof value === 'string' ? value : JSON.stringify(value);
              } else if (['duration_days','min_participants','max_participants'].includes(field)) {
                if (value === '' || value === null) value = null;
                else value = Number(value);
              }
              tourValues.push(value);
              idx++;
            }
          });
          
          if (tourUpdates.length > 0) {
            tourValues.push(tourId);
            await client.query(
          `UPDATE service_details_tour SET ${tourUpdates.join(', ')} WHERE service_id = $${idx}`,
              tourValues
            );
            console.log('✅ Updated tour details');
          }
        } else {
          await client.query(`
            INSERT INTO service_details_tour (service_id, duration_days, country, min_participants, max_participants, itinerary)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [
            tourId,
            updateData.duration_days || null,
            updateData.country || null,
            updateData.min_participants || null,
            updateData.max_participants || null,
            updateData.itinerary ? JSON.stringify(updateData.itinerary) : null
          ]);
          console.log('✅ Inserted tour details');
        }
      }

      // 3. Update/Insert hotel details (remove updated_at; map field names where needed)
          const hotelFields = ['hotel_name', 'hotel_address', 'star_rating', 'room_types', 'bed_types', 'room_area', 'max_occupancy', 'check_in_time', 'check_out_time', 'amenities'];
      const hasHotelData = hotelFields.some(field => updateData[field] !== undefined);
      
      if (hasHotelData) {
        const checkHotel = await client.query(
          'SELECT service_id FROM service_details_hotel WHERE service_id = $1',
          [tourId]
        );
        
        if (checkHotel.rows.length > 0) {
          // Update existing
          const hotelUpdates = [];
          const hotelValues = [];
          let idx = 1;
          
          const fieldMap = {
            room_types: 'room_type',
            bed_types: 'bed_type',
            room_area: 'room_size'
          };
          
          hotelFields.forEach(field => {
            if (updateData[field] !== undefined) {
              const dbField = fieldMap[field] || field;
              hotelUpdates.push(`${dbField} = $${idx}`);
              let value = updateData[field];
              if (field === 'amenities') {
                if (Array.isArray(value)) value = JSON.stringify(value);
                else if (typeof value === 'string') {
                  // If string that looks like JSON array, keep; else wrap as single-item array
                  try { JSON.parse(value); } catch { value = JSON.stringify([value]); }
                } else value = JSON.stringify([]);
              }
              if (field === 'room_area') {
                const num = parseFloat(value);
                value = isNaN(num) ? null : num;
              }
              if (field === 'star_rating' || field === 'max_occupancy') {
                const num = parseInt(value);
                value = isNaN(num) ? null : num;
              }
              hotelValues.push(value);
              idx++;
            }
          });
          
          if (hotelUpdates.length > 0) {
            hotelValues.push(tourId);
            await client.query(
              `UPDATE service_details_hotel SET ${hotelUpdates.join(', ')} WHERE service_id = $${idx}`,
              hotelValues
            );
            console.log('✅ Updated hotel details');
          }
        } else {
          // Insert new
          await client.query(`
            INSERT INTO service_details_hotel (service_id, hotel_name, hotel_address, star_rating, room_type, bed_type, room_size, max_occupancy, amenities, check_in_time, check_out_time)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `, [
            tourId,
            updateData.hotel_name || null,
            updateData.hotel_address || null,
            updateData.star_rating || null,
            updateData.room_types || null,
            updateData.bed_types || null,
            updateData.room_area ? parseFloat(updateData.room_area) : null,
            updateData.max_occupancy || null,
            updateData.amenities ? JSON.stringify(updateData.amenities) : null,
            updateData.check_in_time || null,
            updateData.check_out_time || null
          ]);
          console.log('✅ Inserted hotel details');
        }
      }

      // 4. Update/Insert flight details
      // Current schema: service_details_flight(service_id, route_id, flight_number, airline, cabin_classes jsonb)
      // We will persist provided flight-related fields into cabin_classes JSONB for flexibility
      const flightFields = ['airline', 'flight_number', 'departure_airport', 'arrival_airport', 'departure_time', 'arrival_time', 'aircraft_type', 'baggage_allowance', 'cabin_class'];
      const hasFlightData = flightFields.some(field => updateData[field] !== undefined);
      
      if (hasFlightData) {
        const checkFlight = await client.query(
          'SELECT service_id FROM service_details_flight WHERE service_id = $1',
          [tourId]
        );
        
        // Build cabin_classes JSON from provided fields
        const cabinClasses = {};
        if (updateData.cabin_class !== undefined) cabinClasses.cabin_class = updateData.cabin_class;
        if (updateData.aircraft_type !== undefined) cabinClasses.aircraft_type = updateData.aircraft_type;
        if (updateData.baggage_allowance !== undefined) cabinClasses.baggage_allowance = updateData.baggage_allowance;
        if (updateData.departure_airport !== undefined) cabinClasses.departure_airport = updateData.departure_airport;
        if (updateData.arrival_airport !== undefined) cabinClasses.arrival_airport = updateData.arrival_airport;
        if (updateData.departure_time !== undefined) cabinClasses.departure_time = updateData.departure_time;
        if (updateData.arrival_time !== undefined) cabinClasses.arrival_time = updateData.arrival_time;

        if (checkFlight.rows.length > 0) {
          // Update existing: only airline, flight_number direct; rest go to cabin_classes JSONB
          const flightUpdates = [];
          const flightValues = [];
          let idx = 1;

          if (updateData.airline !== undefined) { flightUpdates.push(`airline = $${idx++}`); flightValues.push(updateData.airline); }
          if (updateData.flight_number !== undefined) { flightUpdates.push(`flight_number = $${idx++}`); flightValues.push(updateData.flight_number); }
          if (Object.keys(cabinClasses).length > 0) { flightUpdates.push(`cabin_classes = $${idx++}`); flightValues.push(JSON.stringify(cabinClasses)); }

          if (flightUpdates.length > 0) {
            flightValues.push(tourId);
            await client.query(
              `UPDATE service_details_flight SET ${flightUpdates.join(', ')} WHERE service_id = $${idx}`,
              flightValues
            );
            console.log('✅ Updated flight details');
          }
        } else {
          // Insert new
          await client.query(`
            INSERT INTO service_details_flight (service_id, airline, flight_number, cabin_classes)
            VALUES ($1, $2, $3, $4)
          `, [
            tourId,
            updateData.airline || null,
            updateData.flight_number || null,
            Object.keys(cabinClasses).length > 0 ? JSON.stringify(cabinClasses) : null
          ]);
          console.log('✅ Inserted flight details');
        }
      }

      await client.query('COMMIT');
      console.log('✅ Update transaction committed');
      
      // Return updated tour
      return await this.findById(tourId);
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error updating service, rolling back:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Delete tour (soft delete by setting is_active = false)
  static async delete(tourId) {
    const query = `
      UPDATE services 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [tourId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error deleting tour:', error);
      throw error;
    }
  }

  // Hard delete tour (permanent)
  static async hardDelete(tourId) {
    const query = `DELETE FROM services WHERE id = $1 RETURNING *`;

    try {
      const result = await pool.query(query, [tourId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error hard deleting tour:', error);
      throw error;
    }
  }

  // Get tour statistics
  static async getStats() {
    const query = `
      SELECT
        COUNT(*) as total_tours,
        COUNT(CASE WHEN s.status = 'ACTIVE' THEN 1 END) as active_tours,
        COUNT(CASE WHEN s.status = 'DRAFT' THEN 1 END) as inactive_tours,
        AVG(sv.price) as avg_price,
        MIN(sv.price) as min_price,
        MAX(sv.price) as max_price,
        COUNT(DISTINCT std.country) as unique_locations
      FROM services s
      LEFT JOIN service_details_tour std ON s.id = std.service_id
      LEFT JOIN service_variants sv ON s.id = sv.service_id
      WHERE s.service_type = 'TOUR'
    `;

    try {
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching tour stats:', error);
      throw error;
    }
  }

  // Get popular tours
  static async getPopular(limit = 10) {
    const query = `
      SELECT 
        s.*,
        COUNT(bi.id) as booking_count,
        0::decimal as avg_rating
      FROM services s
      LEFT JOIN booking_items bi ON s.id = bi.service_id
      WHERE s.service_type = 'TOUR' AND s.is_active = true
      GROUP BY s.id
      ORDER BY booking_count DESC, avg_rating DESC
      LIMIT $1
    `;

    try {
      const result = await pool.query(query, [limit]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching popular tours:', error);
      throw error;
    }
  }

  // Bulk update tours
  static async bulkUpdate(tourIds, updateData) {
    const allowedFields = ['is_active'];
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = $${paramIndex}`);
        values.push(updateData[key]);
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    const placeholders = tourIds.map((_, index) => `$${paramIndex + index}`).join(',');
    values.push(...tourIds);

    const query = `
      UPDATE services 
      SET ${updateFields.join(', ')}
      WHERE id IN (${placeholders})
      RETURNING *
    `;

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error bulk updating tours:', error);
      throw error;
    }
  }
}

module.exports = Tour;
