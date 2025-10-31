const { query, getClient } = require('../config/database-supabase');

/**
 * Service for managing service variants with attributes
 */
class VariantService {
  
  /**
   * Get all variants for a service
   */
  static async getVariantsByServiceId(serviceId) {
    try {
      const result = await query(`
        SELECT 
          id,
          service_id,
          code,
          name,
          price,
          currency,
          capacity,
          attributes,
          is_active,
          created_at,
          updated_at
        FROM service_variants 
        WHERE service_id = $1
        ORDER BY price ASC
      `, [serviceId]);
      
      return result.rows;
    } catch (error) {
      console.error('Error getting variants:', error);
      throw error;
    }
  }

  /**
   * Update variant attributes
   */
  static async updateVariantAttributes(variantId, attributes) {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      
      const result = await client.query(`
        UPDATE service_variants 
        SET attributes = $1
        WHERE id = $2
        RETURNING *
      `, [JSON.stringify(attributes), variantId]);
      
      if (result.rows.length === 0) {
        throw new Error('Variant not found');
      }
      
      await client.query('COMMIT');
      return result.rows[0];
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Bulk update variants with attributes
   */
  static async bulkUpdateVariants(serviceId, variants) {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      
      const updatedVariants = [];
      
      for (const variant of variants) {
        const { id, name, price, currency, capacity, attributes, is_active } = variant;
        
        if (!id) {
          throw new Error('Variant ID is required');
        }
        
        const updates = [];
        const values = [];
        let paramIndex = 1;
        
        if (name !== undefined) {
          updates.push(`name = $${paramIndex++}`);
          values.push(name);
        }
        
        if (price !== undefined) {
          updates.push(`price = $${paramIndex++}`);
          values.push(price);
        }
        
        if (currency !== undefined) {
          updates.push(`currency = $${paramIndex++}`);
          values.push(currency);
        }
        
        if (capacity !== undefined) {
          updates.push(`capacity = $${paramIndex++}`);
          values.push(capacity);
        }
        
        if (attributes !== undefined) {
          updates.push(`attributes = $${paramIndex++}`);
          values.push(JSON.stringify(attributes));
        }
        
        if (is_active !== undefined) {
          updates.push(`is_active = $${paramIndex++}`);
          values.push(is_active);
        }
        
        // Note: updated_at column doesn't exist in service_variants table
        values.push(id, serviceId);
        
        const updateQuery = `
          UPDATE service_variants 
          SET ${updates.join(', ')}
          WHERE id = $${paramIndex} AND service_id = $${paramIndex + 1}
          RETURNING *
        `;
        
        const result = await client.query(updateQuery, values);
        
        if (result.rows.length > 0) {
          updatedVariants.push(result.rows[0]);
        }
      }
      
      await client.query('COMMIT');
      return updatedVariants;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Query variants by attributes
   */
  static async queryVariantsByAttributes(serviceId, filters = {}) {
    try {
      const { 
        cabin_class, 
        baggage_checked, 
        baggage_carry_on,
        meal_included,
        priority_boarding 
      } = filters;
      
      let whereConditions = ['service_id = $1'];
      const values = [serviceId];
      let paramIndex = 2;
      
      if (cabin_class) {
        whereConditions.push(`attributes->>'cabin_class' = $${paramIndex++}`);
        values.push(cabin_class);
      }
      
      if (baggage_checked) {
        whereConditions.push(`attributes->'baggage'->>'checked' = $${paramIndex++}`);
        values.push(baggage_checked);
      }
      
      if (baggage_carry_on) {
        whereConditions.push(`attributes->'baggage'->>'carry_on' = $${paramIndex++}`);
        values.push(baggage_carry_on);
      }
      
      if (meal_included !== undefined) {
        whereConditions.push(`attributes->>'meal_included' = $${paramIndex++}`);
        values.push(meal_included);
      }
      
      if (priority_boarding !== undefined) {
        whereConditions.push(`attributes->>'priority_boarding' = $${paramIndex++}`);
        values.push(priority_boarding);
      }
      
      const query = `
        SELECT 
          id,
          service_id,
          code,
          name,
          price,
          currency,
          capacity,
          attributes,
          is_active,
          created_at,
          updated_at
        FROM service_variants 
        WHERE ${whereConditions.join(' AND ')}
        ORDER BY price ASC
      `;
      
      const result = await query(query, values);
      return result.rows;
      
    } catch (error) {
      console.error('Error querying variants:', error);
      throw error;
    }
  }

  /**
   * Create flight attributes structure
   */
  static createFlightAttributes(data) {
    const {
      cabin_class = 'Economy',
      baggage_checked = '20kg',
      baggage_carry_on = '7kg',
      seat_type = 'standard',
      meal_included = true,
      priority_boarding = false,
      lounge_access = false,
      entertainment = []
    } = data;

    return {
      cabin_class,
      baggage: {
        checked: baggage_checked,
        carry_on: baggage_carry_on
      },
      seat_type,
      meal_included,
      priority_boarding,
      lounge_access,
      entertainment
    };
  }

  /**
   * Create hotel attributes structure
   */
  static createHotelAttributes(data) {
    const {
      room_category = 'standard',
      bed_type = 'double',
      view_type = 'city',
      amenities = [],
      max_occupancy = 2,
      extra_bed_available = false
    } = data;

    return {
      room_category,
      bed_type,
      view_type,
      amenities,
      max_occupancy,
      extra_bed_available
    };
  }

  /**
   * Create tour attributes structure
   */
  static createTourAttributes(data) {
    const {
      age_group = 'adult',
      discount_percentage = 0,
      special_requirements = [],
      included_services = [],
      excluded_services = []
    } = data;

    return {
      age_group,
      discount_percentage,
      special_requirements,
      included_services,
      excluded_services
    };
  }

  /**
   * Validate attributes structure
   */
  static validateAttributes(attributes, serviceType) {
    if (!attributes || typeof attributes !== 'object') {
      return { valid: false, error: 'Attributes must be an object' };
    }

    switch (serviceType) {
      case 'FLIGHT':
        if (attributes.cabin_class && !['Economy', 'Business', 'First'].includes(attributes.cabin_class)) {
          return { valid: false, error: 'Invalid cabin class' };
        }
        break;
      
      case 'HOTEL':
        if (attributes.room_category && !['standard', 'deluxe', 'suite'].includes(attributes.room_category)) {
          return { valid: false, error: 'Invalid room category' };
        }
        break;
      
      case 'TOUR':
        if (attributes.age_group && !['adult', 'child', 'senior'].includes(attributes.age_group)) {
          return { valid: false, error: 'Invalid age group' };
        }
        break;
    }

    return { valid: true };
  }
}

module.exports = VariantService;
