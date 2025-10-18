const { pool } = require('../config/database');

async function checkUserRoleRelations() {
  console.log('🔍 KIỂM TRA QUAN HỆ GIỮA USERS, USER_ROLES VÀ ROLES...\n');

  try {
    // 1. Kiểm tra bảng roles
    console.log('📋 BẢNG ROLES:');
    const rolesQuery = `
      SELECT
        r.id,
        r.role_name,
        r.description,
        r.created_at,
        COUNT(ur.user_id) as user_count
      FROM roles r
      LEFT JOIN user_roles ur ON r.id = ur.role_id
      GROUP BY r.id, r.role_name, r.description, r.created_at
      ORDER BY r.id;
    `;

    const rolesResult = await pool.query(rolesQuery);
    console.log('📊 Query executed', { text: rolesQuery, duration: 0, rows: rolesResult.rows.length });

    if (rolesResult.rows.length > 0) {
      console.log('✅ Dữ liệu roles:');
      rolesResult.rows.forEach(role => {
        console.log(`   - ID: ${role.id}, Name: ${role.role_name}, Description: ${role.description || 'N/A'}, Users: ${role.user_count}`);
      });
    } else {
      console.log('❌ Bảng roles trống!');
    }

    // 2. Kiểm tra bảng users
    console.log('\n👤 BẢNG USERS:');
    const usersQuery = `
      SELECT
        u.id,
        u.username,
        u.auth_provider,
        u.is_active,
        u.last_login,
        u.created_at,
        p.full_name,
        p.email,
        p.phone_number,
        p.party_type,
        COUNT(ur.role_id) as role_count
      FROM users u
      JOIN parties p ON u.party_id = p.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      GROUP BY u.id, u.username, u.auth_provider, u.is_active, u.last_login, u.created_at,
               p.full_name, p.email, p.phone_number, p.party_type
      ORDER BY u.id;
    `;

    const usersResult = await pool.query(usersQuery);
    console.log('📊 Query executed', { text: usersQuery, duration: 0, rows: usersResult.rows.length });

    if (usersResult.rows.length > 0) {
      console.log('✅ Dữ liệu users:');
      usersResult.rows.forEach(user => {
        console.log(`   - ID: ${user.id}, Username: ${user.username}, Name: ${user.full_name}, Email: ${user.email}, Roles: ${user.role_count}`);
      });
    } else {
      console.log('❌ Bảng users trống!');
    }

    // 3. Kiểm tra bảng user_roles
    console.log('\n🔗 BẢNG USER_ROLES:');
    const userRolesQuery = `
      SELECT
        ur.user_id,
        ur.role_id,
        ur.assigned_at,
        u.username,
        p.full_name,
        p.email,
        r.role_name,
        r.description as role_description
      FROM user_roles ur
      JOIN users u ON ur.user_id = u.id
      JOIN parties p ON u.party_id = p.id
      JOIN roles r ON ur.role_id = r.id
      ORDER BY ur.user_id, ur.role_id;
    `;

    const userRolesResult = await pool.query(userRolesQuery);
    console.log('📊 Query executed', { text: userRolesQuery, duration: 0, rows: userRolesResult.rows.length });

    if (userRolesResult.rows.length > 0) {
      console.log('✅ Dữ liệu user_roles:');
      userRolesResult.rows.forEach(ur => {
        console.log(`   - User: ${ur.full_name} (${ur.username}) → Role: ${ur.role_name}`);
      });
    } else {
      console.log('❌ Bảng user_roles trống!');
    }

    // 4. Kiểm tra foreign keys
    console.log('\n🔗 KIỂM TRA FOREIGN KEYS:');
    const fkQuery = `
      SELECT
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
      WHERE tc.table_name IN ('users', 'roles', 'user_roles') AND tc.constraint_type = 'FOREIGN KEY';
    `;

    const fkResult = await pool.query(fkQuery);
    console.log('📊 Query executed', { text: fkQuery, duration: 0, rows: fkResult.rows.length });

    if (fkResult.rows.length > 0) {
      console.log('✅ Các foreign keys:');
      fkResult.rows.forEach(fk => {
        console.log(`   - ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
      });
    } else {
      console.log('❌ Không có foreign keys!');
    }

    // 5. Kiểm tra indexes
    console.log('\n📊 KIỂM TRA INDEXES:');
    const indexesQuery = `
      SELECT
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE tablename IN ('users', 'roles', 'user_roles')
      ORDER BY tablename, indexname;
    `;

    const indexesResult = await pool.query(indexesQuery);
    console.log('📊 Query executed', { text: indexesQuery, duration: 0, rows: indexesResult.rows.length });

    if (indexesResult.rows.length > 0) {
      console.log('✅ Các indexes:');
      indexesResult.rows.forEach(idx => {
        console.log(`   - ${idx.indexname} trên ${idx.tablename}`);
      });
    } else {
      console.log('❌ Không có indexes!');
    }

    // 6. Kiểm tra constraints
    console.log('\n🔒 KIỂM TRA CONSTRAINTS:');
    const constraintsQuery = `
      SELECT
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS referenced_table,
        ccu.column_name AS referenced_column
      FROM information_schema.table_constraints AS tc
      LEFT JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
      LEFT JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
      WHERE tc.table_name IN ('users', 'roles', 'user_roles')
      ORDER BY tc.table_name, tc.constraint_name;
    `;

    const constraintsResult = await pool.query(constraintsQuery);
    console.log('📊 Query executed', { text: constraintsQuery, duration: 0, rows: constraintsResult.rows.length });

    if (constraintsResult.rows.length > 0) {
      console.log('✅ Các constraints:');
      constraintsResult.rows.forEach(constraint => {
        if (constraint.constraint_type === 'FOREIGN KEY') {
          console.log(`   - ${constraint.table_name}.${constraint.column_name} → ${constraint.referenced_table}.${constraint.referenced_column}`);
        } else {
          console.log(`   - ${constraint.constraint_type}: ${constraint.constraint_name} trên ${constraint.table_name}`);
        }
      });
    } else {
      console.log('❌ Không có constraints!');
    }

    console.log('\n✅ KIỂM TRA HOÀN TẤT!');

  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra quan hệ:', error);
  }
}

// Chạy kiểm tra
checkUserRoleRelations();
