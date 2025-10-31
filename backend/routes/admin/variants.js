const express = require('express');
const router = express.Router();
const { query, getClient } = require('../../config/database-supabase');
const { authenticate, authorize } = require('../../middleware/auth');

// Apply admin authentication and authorization to all routes
router.use(authenticate);
router.use(authorize(['admin']));

/**
 * GET /api/admin/variants/:serviceId
 * Get all variants for a service with their attributes
 */
router.get('/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    
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
        created_at
      FROM service_variants 
      WHERE service_id = $1
      ORDER BY price ASC
    `, [serviceId]);
    
    res.json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('❌ Error fetching variants:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch variants',
      details: error.message
    });
  }
});

/**
 * PUT /api/admin/variants/:variantId
 * Update a specific variant including its attributes
 */
router.put('/:variantId', async (req, res) => {
  const client = await getClient();
  try {
    const { variantId } = req.params;
    const { 
      name, 
      price, 
      currency, 
      capacity, 
      attributes,
      is_active 
    } = req.body;
    
    await client.query('BEGIN');
    
    // Build dynamic update query
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
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }
    
    values.push(variantId);
    
    const updateQuery = `
      UPDATE service_variants 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await client.query(updateQuery, values);
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: 'Variant not found'
      });
    }
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Variant updated successfully'
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error updating variant:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update variant',
      details: error.message
    });
  } finally {
    client.release();
  }
});

/**
 * PUT /api/admin/variants/:variantId/attributes
 * Update only the attributes field of a variant
 */
router.put('/:variantId/attributes', async (req, res) => {
  try {
    const { variantId } = req.params;
    const { attributes } = req.body;
    
    if (!attributes || typeof attributes !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Attributes must be a valid object'
      });
    }
    
    const result = await query(`
      UPDATE service_variants 
      SET attributes = $1
      WHERE id = $2
      RETURNING *
    `, [JSON.stringify(attributes), variantId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Variant not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Variant attributes updated successfully'
    });
    
  } catch (error) {
    console.error('❌ Error updating variant attributes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update variant attributes',
      details: error.message
    });
  }
});

/**
 * POST /api/admin/variants/:serviceId/bulk-update
 * Update multiple variants at once
 */
router.post('/:serviceId/bulk-update', async (req, res) => {
  const client = await getClient();
  try {
    const { serviceId } = req.params;
    const { variants } = req.body;
    
    if (!Array.isArray(variants)) {
      return res.status(400).json({
        success: false,
        error: 'Variants must be an array'
      });
    }
    
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
      values.push(id);
      
      const updateQuery = `
        UPDATE service_variants 
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex} AND service_id = $${paramIndex + 1}
        RETURNING *
      `;
      
      values.push(serviceId);
      
      const result = await client.query(updateQuery, values);
      
      if (result.rows.length > 0) {
        updatedVariants.push(result.rows[0]);
      }
    }
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      data: updatedVariants,
      message: `${updatedVariants.length} variants updated successfully`
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error bulk updating variants:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk update variants',
      details: error.message
    });
  } finally {
    client.release();
  }
});

/**
 * GET /api/admin/variants/:serviceId/query
 * Query variants by attributes (JSON queries)
 */
router.get('/:serviceId/query', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { 
      cabin_class, 
      baggage_checked, 
      baggage_carry_on,
      meal_included,
      priority_boarding 
    } = req.query;
    
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
        created_at
      FROM service_variants 
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY price ASC
    `;
    
    const result = await query(query, values);
    
    res.json({
      success: true,
      data: result.rows,
      query: { cabin_class, baggage_checked, baggage_carry_on, meal_included, priority_boarding }
    });
    
  } catch (error) {
    console.error('❌ Error querying variants:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to query variants',
      details: error.message
    });
  }
});

module.exports = router;
