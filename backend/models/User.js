const { pool } = require('../config/database-supabase');
const bcrypt = require('bcryptjs');

class User {
  // Find user by email
  static async findByEmail(email) {
    const query = `
      SELECT
        u.*,
        p.full_name,
        p.email,
        p.phone_number,
        p.party_type,
        p.is_email_verified,
        p.is_phone_verified,
        array_agg(r.role_name) as roles
      FROM users u
      JOIN parties p ON u.party_id = p.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE p.email = $1 AND u.is_active = true
      GROUP BY u.id, p.id
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      return {
        id: user.id,
        username: user.username,
        password_hash: user.password_hash,
        auth_provider: user.auth_provider,
        provider_user_id: user.provider_user_id,
        is_active: user.is_active,
        last_login: user.last_login,
        created_at: user.created_at,
        updated_at: user.updated_at,
        // Party info
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        party_type: user.party_type,
        is_email_verified: user.is_email_verified,
        is_phone_verified: user.is_phone_verified,
        // Roles
        roles: user.roles || []
      };
    }

    return null;
  }

  // Find user by ID
  static async findById(userId) {
    const query = `
      SELECT
        u.*,
        p.full_name,
        p.email,
        p.phone_number,
        p.party_type,
        array_agg(r.role_name) as roles
      FROM users u
      JOIN parties p ON u.party_id = p.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = $1
      GROUP BY u.id, p.id
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      return {
        id: user.id,
        username: user.username,
        password_hash: user.password_hash,
        auth_provider: user.auth_provider,
        provider_user_id: user.provider_user_id,
        is_active: user.is_active,
        last_login: user.last_login,
        created_at: user.created_at,
        updated_at: user.updated_at,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        party_type: user.party_type,
        roles: user.roles || []
      };
    }

    return null;
  }

  // Create new user
  static async create(userData) {
    const {
      party_id,
      username,
      password_hash,
      auth_provider = 'local',
      provider_user_id = null,
      is_active = true
    } = userData;

    const query = `
      INSERT INTO users (
        party_id, username, password_hash, auth_provider, provider_user_id, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [party_id, username, password_hash, auth_provider, provider_user_id, is_active];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  // Update last login
  static async updateLastLogin(userId) {
    const query = `
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  // Get user roles
  static async getUserRoles(userId) {
    const query = `
      SELECT r.role_name, r.description
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows.map(row => ({
      name: row.role_name,
      description: row.description
    }));
  }

  // Check if user has specific role
  static async hasRole(userId, roleName) {
    const query = `
      SELECT EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = $1 AND r.role_name = $2
      )
    `;

    const result = await pool.query(query, [userId, roleName]);
    return result.rows[0].exists;
  }

  // Assign role to user
  static async assignRole(userId, roleName) {
    // First get role ID
    const roleQuery = 'SELECT id FROM roles WHERE role_name = $1';
    const roleResult = await pool.query(roleQuery, [roleName]);

    if (roleResult.rows.length === 0) {
      throw new Error(`Role '${roleName}' not found`);
    }

    const roleId = roleResult.rows[0].id;

    // Assign role to user
    const assignQuery = `
      INSERT INTO user_roles (user_id, role_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, role_id) DO NOTHING
      RETURNING *
    `;

    const result = await pool.query(assignQuery, [userId, roleId]);
    return result.rows[0];
  }

  // Remove role from user
  static async removeRole(userId, roleName) {
    // First get role ID
    const roleQuery = 'SELECT id FROM roles WHERE role_name = $1';
    const roleResult = await pool.query(roleQuery, [roleName]);

    if (roleResult.rows.length === 0) {
      throw new Error(`Role '${roleName}' not found`);
    }

    const roleId = roleResult.rows[0].id;

    // Remove role from user
    const removeQuery = `
      DELETE FROM user_roles
      WHERE user_id = $1 AND role_id = $2
      RETURNING *
    `;

    const result = await pool.query(removeQuery, [userId, roleId]);
    return result.rows[0];
  }

  // Validate password
  static async validatePassword(user, password) {
    if (!user.password_hash) {
      return false;
    }

    return await bcrypt.compare(password, user.password_hash);
  }

  // Hash password
  static async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}

module.exports = User;
