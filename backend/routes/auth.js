const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database-supabase');
const User = require('../models/User');

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Validate password
    const isValidPassword = await User.validatePassword(user, password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Get user roles
    const roles = await User.getUserRoles(user.id);

    // Generate JWT token with user's roles
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        roles: roles.map(r => r.name)
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.full_name,
          email: user.email,
          phone: user.phone_number,
          roles: roles.map(r => r.name)
        },
        token
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// POST /api/auth/register - User registration
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Full name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Create party
    const partyResult = await query(`
      INSERT INTO parties (party_type, full_name, email, phone_number, is_email_verified)
      VALUES ('PERSON', $1, $2, $3, false)
      RETURNING id
    `, [fullName, email, phone || null]);

    const partyId = partyResult.rows[0].id;

    // Create user
    const hashedPassword = await User.hashPassword(password);
    const user = await User.create({
      party_id: partyId,
      username: email,
      password_hash: hashedPassword,
      auth_provider: 'local',
      is_active: true
    });

    // Assign default 'user' role
    await User.assignRole(user.id, 'user');

    // Get user with roles
    const userWithRoles = await User.findById(user.id);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: email,
        roles: userWithRoles.roles
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: fullName,
          email: email,
          phone: phone,
          roles: userWithRoles.roles
        },
        token
      },
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// GET /api/auth/me - Get current user info
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const userQuery = `
      SELECT 
        u.*,
        p.full_name,
        p.email,
        p.phone_number,
        p.party_type
      FROM users u
      JOIN parties p ON u.party_id = p.id
      WHERE u.id = $1 AND u.is_active = true
    `;

    const userResult = await query(userQuery, [decoded.userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const user = userResult.rows[0];

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        phone: user.phone_number,
        roles: decoded.roles || []
      }
    });

  } catch (error) {
    console.error('Error getting user info:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

// POST /api/auth/logout - User logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;
