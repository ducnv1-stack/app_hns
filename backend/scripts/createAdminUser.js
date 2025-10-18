const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    console.log('🔍 Creating admin user...');
    
    // Check if admin user already exists
    const existingUser = await query('SELECT * FROM users WHERE email = $1', ['admin@hanoisuntravel.com']);
    
    if (existingUser.rows.length > 0) {
      console.log('✅ Admin user already exists:', existingUser.rows[0].email);
      return existingUser.rows[0];
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create user
    const userResult = await query(`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `, ['admin@hanoisuntravel.com', hashedPassword, 'Admin', 'User', '0123456789', true]);
    
    const user = userResult.rows[0];
    console.log('✅ Created user:', user.email);
    
    // Get admin role
    const roleResult = await query('SELECT * FROM roles WHERE name = $1', ['admin']);
    if (roleResult.rows.length === 0) {
      console.log('❌ Admin role not found');
      return;
    }
    
    const adminRole = roleResult.rows[0];
    
    // Assign admin role to user
    await query(`
      INSERT INTO user_roles (user_id, role_id, created_at)
      VALUES ($1, $2, NOW())
    `, [user.id, adminRole.id]);
    
    console.log('✅ Assigned admin role to user');
    
    console.log('\n🎉 Admin user created successfully!');
    console.log('📧 Email: admin@hanoisuntravel.com');
    console.log('🔑 Password: admin123');
    
    return user;
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    process.exit(0);
  }
}

createAdminUser();
