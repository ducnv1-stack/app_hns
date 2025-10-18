const { pool } = require('../config/database');

async function checkUserTables() {
  console.log('🔍 KIỂM TRA CÁC BẢNG USER TRONG DATABASE...\n');

  try {
    // Kiểm tra bảng users
    console.log('📋 KIỂM TRA BẢNG: users');
    const usersQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `;
    
    const usersResult = await pool.query(usersQuery);
    console.log('📊 Query executed', { text: usersQuery, duration: 0, rows: usersResult.rows.length });
    
    if (usersResult.rows.length > 0) {
      console.log('✅ Bảng users tồn tại với cấu trúc:');
      usersResult.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `(default: ${col.column_default})` : ''}`);
      });
    } else {
      console.log('❌ Bảng users chưa tồn tại!');
    }

    // Kiểm tra bảng roles
    console.log('\n📋 KIỂM TRA BẢNG: roles');
    const rolesQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'roles'
      ORDER BY ordinal_position;
    `;
    
    const rolesResult = await pool.query(rolesQuery);
    console.log('📊 Query executed', { text: rolesQuery, duration: 0, rows: rolesResult.rows.length });
    
    if (rolesResult.rows.length > 0) {
      console.log('✅ Bảng roles tồn tại với cấu trúc:');
      rolesResult.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `(default: ${col.column_default})` : ''}`);
      });
    } else {
      console.log('❌ Bảng roles chưa tồn tại!');
    }

    // Kiểm tra bảng user_roles
    console.log('\n📋 KIỂM TRA BẢNG: user_roles');
    const userRolesQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'user_roles'
      ORDER BY ordinal_position;
    `;
    
    const userRolesResult = await pool.query(userRolesQuery);
    console.log('📊 Query executed', { text: userRolesQuery, duration: 0, rows: userRolesResult.rows.length });
    
    if (userRolesResult.rows.length > 0) {
      console.log('✅ Bảng user_roles tồn tại với cấu trúc:');
      userRolesResult.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `(default: ${col.column_default})` : ''}`);
      });
    } else {
      console.log('❌ Bảng user_roles chưa tồn tại!');
    }

    // Kiểm tra indexes
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
      console.log('✅ Các indexes đã được tạo:');
      indexesResult.rows.forEach(idx => {
        console.log(`   - ${idx.indexname} trên ${idx.tablename}`);
      });
    } else {
      console.log('❌ Chưa có indexes nào được tạo!');
    }

    // Kiểm tra foreign keys
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
      console.log('✅ Các foreign keys đã được tạo:');
      fkResult.rows.forEach(fk => {
        console.log(`   - ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
      });
    } else {
      console.log('❌ Chưa có foreign keys nào được tạo!');
    }

    // Kiểm tra dữ liệu mẫu
    console.log('\n📈 KIỂM TRA DỮ LIỆU MẪU:');
    const dataQuery = `
      SELECT
        (SELECT COUNT(*) FROM users) as users_count,
        (SELECT COUNT(*) FROM roles) as roles_count,
        (SELECT COUNT(*) FROM user_roles) as user_roles_count;
    `;
    
    try {
      const dataResult = await pool.query(dataQuery);
      console.log('📊 Query executed', { text: dataQuery, duration: 0, rows: dataResult.rows.length });
      
      if (dataResult.rows.length > 0) {
        const counts = dataResult.rows[0];
        console.log(`   - Số bản ghi trong users: ${counts.users_count}`);
        console.log(`   - Số bản ghi trong roles: ${counts.roles_count}`);
        console.log(`   - Số bản ghi trong user_roles: ${counts.user_roles_count}`);
      }
    } catch (error) {
      console.log('❌ Không thể kiểm tra dữ liệu mẫu:', error.message);
    }

    // Kiểm tra dữ liệu roles nếu có
    if (rolesResult.rows.length > 0) {
      console.log('\n📋 KIỂM TRA DỮ LIỆU ROLES:');
      try {
        const rolesDataQuery = `SELECT * FROM roles ORDER BY id;`;
        const rolesDataResult = await pool.query(rolesDataQuery);
        
        if (rolesDataResult.rows.length > 0) {
          console.log('✅ Dữ liệu roles:');
          rolesDataResult.rows.forEach(role => {
            console.log(`   - ID: ${role.id}, Name: ${role.name}, Description: ${role.description || 'N/A'}`);
          });
        } else {
          console.log('❌ Chưa có dữ liệu roles!');
        }
      } catch (error) {
        console.log('❌ Không thể lấy dữ liệu roles:', error.message);
      }
    }

    // Kiểm tra dữ liệu users nếu có
    if (usersResult.rows.length > 0) {
      console.log('\n📋 KIỂM TRA DỮ LIỆU USERS (5 bản ghi đầu):');
      try {
        const usersDataQuery = `SELECT id, email, full_name, role, created_at FROM users ORDER BY id LIMIT 5;`;
        const usersDataResult = await pool.query(usersDataQuery);
        
        if (usersDataResult.rows.length > 0) {
          console.log('✅ Dữ liệu users:');
          usersDataResult.rows.forEach(user => {
            console.log(`   - ID: ${user.id}, Email: ${user.email}, Name: ${user.full_name}, Role: ${user.role || 'N/A'}`);
          });
        } else {
          console.log('❌ Chưa có dữ liệu users!');
        }
      } catch (error) {
        console.log('❌ Không thể lấy dữ liệu users:', error.message);
      }
    }

    console.log('\n✅ KIỂM TRA HOÀN TẤT!');

  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra database:', error);
  }
}

// Chạy kiểm tra
checkUserTables();
