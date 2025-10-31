const express = require('express');
const router = express.Router();
const { query, getClient } = require('../../config/database-supabase');
const { authenticate, authorize } = require('../../middleware/auth');

// Apply admin authentication and authorization
router.use(authenticate);
router.use(authorize(['admin']));

// GET /api/admin/users - Get all users with filters
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      role = '',
      status = ''
    } = req.query;

    let whereConditions = ['1=1'];
    let queryParams = [];
    let paramIndex = 1;

    // Search by name or email
    if (search) {
      whereConditions.push(`(p.full_name ILIKE $${paramIndex} OR p.email ILIKE $${paramIndex} OR u.username ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Filter by role
    if (role) {
      whereConditions.push(`r.role_name = $${paramIndex}`);
      queryParams.push(role.toUpperCase());
      paramIndex++;
    }

    // Filter by status
    if (status && status !== 'all') {
      whereConditions.push(`u.is_active = $${paramIndex}`);
      queryParams.push(status === 'active');
      paramIndex++;
    }

    const offset = (page - 1) * limit;
    queryParams.push(limit, offset);

    const usersQuery = `
      SELECT 
        u.id,
        u.party_id,
        u.username,
        u.auth_provider,
        u.is_active,
        u.last_login,
        u.created_at,
        u.updated_at,
        p.full_name,
        p.email,
        p.phone_number,
        p.party_type,
        p.is_email_verified,
        p.is_phone_verified,
        p.metadata,
        r.role_name,
        COUNT(DISTINCT b.id) as booking_count,
        COALESCE(SUM(b.total_amount), 0) as total_spent
      FROM users u
      LEFT JOIN parties p ON u.party_id = p.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      LEFT JOIN bookings b ON p.id = b.buyer_party_id
      WHERE ${whereConditions.join(' AND ')}
      GROUP BY u.id, p.id, r.role_name
      ORDER BY u.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT u.id) as total
      FROM users u
      LEFT JOIN parties p ON u.party_id = p.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE ${whereConditions.join(' AND ')}
    `;

    const [usersResult, countResult] = await Promise.all([
      query(usersQuery, queryParams),
      query(countQuery, queryParams.slice(0, -2))
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        users: usersResult.rows,
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
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// GET /api/admin/users/stats/overview - Get user statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE u.is_active = true) as active_users,
        COUNT(*) FILTER (WHERE u.is_active = false) as inactive_users,
        COUNT(*) FILTER (WHERE u.created_at > NOW() - INTERVAL '30 days') as new_users_30d,
        COUNT(*) FILTER (WHERE p.is_email_verified = true) as verified_users
      FROM users u
      LEFT JOIN parties p ON u.party_id = p.id
    `;

    const roleStatsQuery = `
      SELECT 
        r.role_name,
        COUNT(ur.user_id) as user_count
      FROM roles r
      LEFT JOIN user_roles ur ON r.id = ur.role_id
      GROUP BY r.role_name
    `;

    const [statsResult, roleStatsResult] = await Promise.all([
      query(statsQuery),
      query(roleStatsQuery)
    ]);

    res.json({
      success: true,
      data: {
        overview: statsResult.rows[0],
        by_role: roleStatsResult.rows
      }
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user statistics'
    });
  }
});

// GET /api/admin/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const userQuery = `
      SELECT 
        u.id,
        u.party_id,
        u.username,
        u.auth_provider,
        u.is_active,
        u.last_login,
        u.created_at,
        u.updated_at,
        p.full_name,
        p.email,
        p.phone_number,
        p.party_type,
        p.is_email_verified,
        p.is_phone_verified,
        p.metadata,
        r.role_name,
        r.id as role_id
      FROM users u
      LEFT JOIN parties p ON u.party_id = p.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = $1
    `;

    const bookingsQuery = `
      SELECT 
        b.id,
        b.booking_code,
        b.status,
        b.total_amount,
        b.created_at,
        s.name as service_name
      FROM bookings b
      LEFT JOIN booking_items bi ON b.id = bi.booking_id
      LEFT JOIN services s ON bi.service_id = s.id
      LEFT JOIN users u ON b.buyer_party_id = u.party_id
      WHERE u.id = $1
      ORDER BY b.created_at DESC
      LIMIT 10
    `;

    const [userResult, bookingsResult] = await Promise.all([
      query(userQuery, [id]),
      query(bookingsQuery, [id])
    ]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...userResult.rows[0],
        recent_bookings: bookingsResult.rows
      }
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

// PUT /api/admin/users/:id/status - Update user status (activate/deactivate)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'is_active must be a boolean'
      });
    }

    const result = await query(
      'UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: `User ${is_active ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user status'
    });
  }
});

// PUT /api/admin/users/:id/role - Update user role
router.put('/:id/role', async (req, res) => {
  const client = await getClient();
  try {
    const { id } = req.params;
    const { role_name } = req.body;

    if (!role_name) {
      return res.status(400).json({
        success: false,
        error: 'role_name is required'
      });
    }

    await client.query('BEGIN');

    // Get role ID
    const roleResult = await client.query('SELECT id FROM roles WHERE role_name = $1', [role_name.toUpperCase()]);
    
    if (roleResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: 'Invalid role'
      });
    }

    const roleId = roleResult.rows[0].id;

    // Delete existing role
    await client.query('DELETE FROM user_roles WHERE user_id = $1', [id]);

    // Assign new role
    await client.query(
      'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
      [id, roleId]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'User role updated successfully'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user role'
    });
  } finally {
    client.release();
  }
});

// POST /api/admin/users - Create new user
router.post('/', async (req, res) => {
  const client = await getClient();
  
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      role = 'USER', 
      isActive = true 
    } = req.body;

    console.log('📝 Create user request body:', req.body);

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      console.log('❌ Validation failed:', { email, password, firstName, lastName });
      return res.status(400).json({
        success: false,
        error: 'Email, password, firstName, and lastName are required'
      });
    }

    await client.query('BEGIN');

    // Check if email already exists
    const existingUser = await client.query(
      'SELECT id FROM parties WHERE email = $1',
      [email]
    );

    console.log('🔍 Checking existing email:', email, 'Found:', existingUser.rows.length);

    if (existingUser.rows.length > 0) {
      await client.query('ROLLBACK');
      console.log('❌ Email already exists:', email);
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create party (person)
    const partyResult = await client.query(`
      INSERT INTO parties (party_type, full_name, email, phone_number, is_email_verified)
      VALUES ('PERSON', $1, $2, $3, true)
      RETURNING id
    `, [`${firstName} ${lastName}`, email, phone || null]);

    const partyId = partyResult.rows[0].id;

    // Create user
    const userResult = await client.query(`
      INSERT INTO users (party_id, username, password_hash, auth_provider, is_active)
      VALUES ($1, $2, $3, 'local', $4)
      RETURNING id
    `, [partyId, email, hashedPassword, isActive]);

    const userId = userResult.rows[0].id;

    // Get role ID
    const roleResult = await client.query(
      'SELECT id FROM roles WHERE role_name = $1',
      [role.toLowerCase()]
    );

    console.log('🔍 Checking role:', role.toLowerCase(), 'Found:', roleResult.rows.length);

    if (roleResult.rows.length === 0) {
      await client.query('ROLLBACK');
      console.log('❌ Invalid role:', role);
      return res.status(400).json({
        success: false,
        error: 'Invalid role'
      });
    }

    const roleId = roleResult.rows[0].id;

    // Assign role
    await client.query(
      'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
      [userId, roleId]
    );

    await client.query('COMMIT');

    console.log('✅ User created successfully:', {
      id: userId,
      email,
      firstName,
      lastName,
      phone,
      role,
      isActive
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: userId,
        email,
        firstName,
        lastName,
        phone,
        role,
        isActive
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  } finally {
    client.release();
  }
});

module.exports = router;
