const express = require('express');
const router = express.Router();
const { query } = require('../config/database-supabase');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/users/profile - Get user profile - Authenticated users
router.get('/profile', authenticate, async (req, res) => {
  try {
    // Get user ID from JWT token
    const userId = req.user.userId;

    const userQuery = `
      SELECT 
        u.*,
        p.full_name,
        p.email,
        p.phone_number,
        p.party_type,
        p.metadata
      FROM users u
      JOIN parties p ON u.party_id = p.id
      WHERE u.id = $1
    `;

    const userResult = await query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get user addresses
    const addressesQuery = `
      SELECT * FROM addresses 
      WHERE party_id = $1 
      ORDER BY is_primary DESC, created_at DESC
    `;
    const addressesResult = await query(addressesQuery, [userResult.rows[0].party_id]);

    // Get user bookings
    const bookingsQuery = `
      SELECT 
        b.*,
        COUNT(bi.id) as item_count
      FROM bookings b
      LEFT JOIN booking_items bi ON b.id = bi.booking_id
      WHERE b.buyer_party_id = $1
      GROUP BY b.id
      ORDER BY b.created_at DESC
      LIMIT 10
    `;
    const bookingsResult = await query(bookingsQuery, [userResult.rows[0].party_id]);

    const userData = {
      ...userResult.rows[0],
      addresses: addressesResult.rows,
      recentBookings: bookingsResult.rows
    };

    res.json({
      success: true,
      data: userData
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile'
    });
  }
});

// PUT /api/users/profile - Update user profile - Authenticated users
router.put('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, email, phoneNumber, metadata } = req.body;

    // Get user's party_id
    const userQuery = `
      SELECT party_id FROM users WHERE id = $1
    `;
    const userResult = await query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const partyId = userResult.rows[0].party_id;

    // Update party information
    const updateQuery = `
      UPDATE parties 
      SET 
        full_name = $1,
        email = $2,
        phone_number = $3,
        metadata = $4,
        updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `;

    const result = await query(updateQuery, [
      fullName, email, phoneNumber, 
      JSON.stringify(metadata || {}), 
      partyId
    ]);

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user profile'
    });
  }
});

// GET /api/users/addresses - Get user addresses - Authenticated users
router.get('/addresses', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user's party_id
    const userQuery = `
      SELECT party_id FROM users WHERE id = $1
    `;
    const userResult = await query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const partyId = userResult.rows[0].party_id;

    const addressesQuery = `
      SELECT * FROM addresses 
      WHERE party_id = $1 
      ORDER BY is_primary DESC, created_at DESC
    `;

    const result = await query(addressesQuery, [partyId]);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching user addresses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user addresses'
    });
  }
});

// POST /api/users/addresses - Add new address - Authenticated users
router.post('/addresses', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      addressLine1,
      addressLine2,
      city,
      state,
      countryCode,
      postalCode,
      addressType = 'OTHER',
      isPrimary = false
    } = req.body;

    // Get user's party_id
    const userQuery = `
      SELECT party_id FROM users WHERE id = $1
    `;
    const userResult = await query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const partyId = userResult.rows[0].party_id;

    // If this is set as primary, unset other primary addresses
    if (isPrimary) {
      await query(`
        UPDATE addresses 
        SET is_primary = false 
        WHERE party_id = $1
      `, [partyId]);
    }

    const insertQuery = `
      INSERT INTO addresses (
        party_id, address_line_1, address_line_2, city, state, 
        country_code, postal_code, address_type, is_primary
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await query(insertQuery, [
      partyId, addressLine1, addressLine2, city, state,
      countryCode, postalCode, addressType, isPrimary
    ]);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Address added successfully'
    });

  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add address'
    });
  }
});

// GET /api/users/bookings - Get user bookings - Authenticated users
router.get('/bookings', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;

    // Get user's party_id
    const userQuery = `
      SELECT party_id FROM users WHERE id = $1
    `;
    const userResult = await query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const partyId = userResult.rows[0].party_id;

    let whereConditions = ['b.buyer_party_id = $1'];
    let queryParams = [partyId];
    let paramIndex = 2;

    if (status) {
      whereConditions.push(`b.status = $${paramIndex}`);
      queryParams.push(status.toUpperCase());
      paramIndex++;
    }

    const offset = (page - 1) * limit;
    queryParams.push(limit, offset);

    const bookingsQuery = `
      SELECT 
        b.*,
        COUNT(bi.id) as item_count,
        STRING_AGG(DISTINCT s.name, ', ') as service_names
      FROM bookings b
      LEFT JOIN booking_items bi ON b.id = bi.booking_id
      LEFT JOIN services s ON bi.service_id = s.id
      WHERE ${whereConditions.join(' AND ')}
      GROUP BY b.id
      ORDER BY b.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM bookings b
      WHERE ${whereConditions.join(' AND ')}
    `;

    const [bookingsResult, countResult] = await Promise.all([
      query(bookingsQuery, queryParams),
      query(countQuery, queryParams.slice(0, -2))
    ]);

    const bookings = bookingsResult.rows;
    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        bookings,
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
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user bookings'
    });
  }
});

module.exports = router;
