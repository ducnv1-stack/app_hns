const { pool } = require('../config/database');

// Test connection first
async function testConnection() {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}
const bcrypt = require('bcryptjs');

async function createUserData() {
  try {
    console.log('🔄 Creating user data (roles and demo users)...\n');

    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // 1. Tạo roles cơ bản
    console.log('📋 Creating roles...');
    const roles = [
      { name: 'admin', description: 'Administrator - Full system access' },
      { name: 'user', description: 'Regular user - Can book tours' },
      { name: 'provider', description: 'Service provider - Can manage services' }
    ];

    for (const role of roles) {
      try {
        await pool.query(`
          INSERT INTO roles (role_name, description) 
          VALUES ($1, $2) 
          ON CONFLICT (role_name) DO NOTHING
        `, [role.name, role.description]);
        console.log(`   ✅ Role '${role.name}' created`);
      } catch (error) {
        console.log(`   ⚠️  Role '${role.name}' already exists or error: ${error.message}`);
      }
    }

    // 2. Tạo demo users
    console.log('\n👤 Creating demo users...');
    
    // Demo Admin User
    try {
      // Tạo party cho admin
      const adminPartyResult = await pool.query(`
        INSERT INTO parties (party_type, full_name, email, phone_number, is_email_verified)
        VALUES ('PERSON', $1, $2, $3, true)
        RETURNING id
      `, ['Admin User', 'admin@hanoisuntravel.com', '0123456789']);

      let adminPartyId;
      if (adminPartyResult.rows.length > 0) {
        adminPartyId = adminPartyResult.rows[0].id;
      } else {
        // Lấy party ID nếu đã tồn tại
        const existingParty = await pool.query('SELECT id FROM parties WHERE email = $1', ['admin@hanoisuntravel.com']);
        adminPartyId = existingParty.rows[0].id;
      }

      // Tạo user cho admin
      const hashedAdminPassword = await bcrypt.hash('admin123', 10);
      const adminUserResult = await pool.query(`
        INSERT INTO users (party_id, username, password_hash, auth_provider, is_active)
        VALUES ($1, $2, $3, 'local', true)
        RETURNING id
      `, [adminPartyId, 'admin@hanoisuntravel.com', hashedAdminPassword]);

      if (adminUserResult.rows.length > 0) {
        const adminUserId = adminUserResult.rows[0].id;
        
        // Gán role admin
        await pool.query(`
          INSERT INTO user_roles (user_id, role_id)
          SELECT $1, id FROM roles WHERE role_name = 'admin'
          ON CONFLICT (user_id, role_id) DO NOTHING
        `, [adminUserId]);
        
        console.log('   ✅ Admin user created: admin@hanoisuntravel.com / admin123');
      } else {
        console.log('   ⚠️  Admin user already exists');
      }
    } catch (error) {
      console.log(`   ❌ Error creating admin user: ${error.message}`);
    }

    // Demo Regular User
    try {
      // Tạo party cho user
      const userPartyResult = await pool.query(`
        INSERT INTO parties (party_type, full_name, email, phone_number, is_email_verified)
        VALUES ('PERSON', $1, $2, $3, true)
        RETURNING id
      `, ['Demo User', 'user@demo.com', '0987654321']);

      let userPartyId;
      if (userPartyResult.rows.length > 0) {
        userPartyId = userPartyResult.rows[0].id;
      } else {
        const existingParty = await pool.query('SELECT id FROM parties WHERE email = $1', ['user@demo.com']);
        userPartyId = existingParty.rows[0].id;
      }

      // Tạo user
      const hashedUserPassword = await bcrypt.hash('user123', 10);
      const userResult = await pool.query(`
        INSERT INTO users (party_id, username, password_hash, auth_provider, is_active)
        VALUES ($1, $2, $3, 'local', true)
        RETURNING id
      `, [userPartyId, 'user@demo.com', hashedUserPassword]);

      if (userResult.rows.length > 0) {
        const userId = userResult.rows[0].id;
        
        // Gán role user
        await pool.query(`
          INSERT INTO user_roles (user_id, role_id)
          SELECT $1, id FROM roles WHERE role_name = 'user'
          ON CONFLICT (user_id, role_id) DO NOTHING
        `, [userId]);
        
        console.log('   ✅ Demo user created: user@demo.com / user123');
      } else {
        console.log('   ⚠️  Demo user already exists');
      }
    } catch (error) {
      console.log(`   ❌ Error creating demo user: ${error.message}`);
    }

    // 3. Kiểm tra kết quả
    console.log('\n📊 Checking results...');
    
    const rolesCount = await pool.query('SELECT COUNT(*) as count FROM roles');
    const usersCount = await pool.query('SELECT COUNT(*) as count FROM users');
    const userRolesCount = await pool.query('SELECT COUNT(*) as count FROM user_roles');
    
    console.log(`   - Roles: ${rolesCount.rows[0].count}`);
    console.log(`   - Users: ${usersCount.rows[0].count}`);
    console.log(`   - User-Role assignments: ${userRolesCount.rows[0].count}`);

    // 4. Hiển thị thông tin đăng nhập
    console.log('\n🔑 Demo Login Credentials:');
    console.log('   👨‍💼 Admin: admin@hanoisuntravel.com / admin123');
    console.log('   👤 User:  user@demo.com / user123');

    console.log('\n✅ User data creation completed!');

  } catch (error) {
    console.error('❌ Error creating user data:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  createUserData()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = createUserData;
