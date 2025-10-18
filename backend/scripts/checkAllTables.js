const { pool } = require('../config/database');

async function checkAllTables() {
  console.log('🔍 KIỂM TRA TẤT CẢ BẢNG TRONG DATABASE...\n');

  try {
    // Lấy danh sách tất cả bảng
    console.log('📋 DANH SÁCH TẤT CẢ BẢNG:');
    const tablesQuery = `
      SELECT table_name, table_type
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    const tablesResult = await pool.query(tablesQuery);
    console.log('📊 Query executed', { text: tablesQuery, duration: 0, rows: tablesResult.rows.length });
    
    if (tablesResult.rows.length > 0) {
      console.log('✅ Các bảng có trong database:');
      tablesResult.rows.forEach((table, index) => {
        console.log(`   ${index + 1}. ${table.table_name} (${table.table_type})`);
      });
    } else {
      console.log('❌ Không tìm thấy bảng nào trong database!');
      return;
    }

    // Kiểm tra chi tiết từng bảng quan trọng
    const importantTables = ['users', 'roles', 'user_roles', 'parties', 'services', 'bookings', 'payments', 'providers'];
    
    console.log('\n📊 KIỂM TRA CHI TIẾT CÁC BẢNG QUAN TRỌNG:');
    
    for (const tableName of importantTables) {
      console.log(`\n📋 BẢNG: ${tableName}`);
      
      try {
        // Kiểm tra bảng có tồn tại không
        const existsQuery = `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          )
        `;
        const existsResult = await pool.query(existsQuery, [tableName]);
        
        if (existsResult.rows[0].exists) {
          // Lấy cấu trúc bảng
          const structureQuery = `
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = $1 AND table_schema = 'public'
            ORDER BY ordinal_position;
          `;
          const structureResult = await pool.query(structureQuery, [tableName]);
          
          console.log(`   ✅ Tồn tại với ${structureResult.rows.length} cột:`);
          structureResult.rows.forEach(col => {
            console.log(`      - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `(default: ${col.column_default})` : ''}`);
          });
          
          // Lấy số lượng bản ghi
          const countQuery = `SELECT COUNT(*) as count FROM ${tableName}`;
          const countResult = await pool.query(countQuery);
          console.log(`      📊 Số bản ghi: ${countResult.rows[0].count}`);
          
        } else {
          console.log(`   ❌ Không tồn tại`);
        }
      } catch (error) {
        console.log(`   ❌ Lỗi: ${error.message}`);
      }
    }

    // Kiểm tra foreign keys
    console.log('\n🔗 KIỂM TRA FOREIGN KEYS:');
    const fkQuery = `
      SELECT
        tc.table_name,
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name;
    `;
    
    const fkResult = await pool.query(fkQuery);
    console.log('📊 Query executed', { text: fkQuery, duration: 0, rows: fkResult.rows.length });
    
    if (fkResult.rows.length > 0) {
      console.log('✅ Các foreign keys:');
      fkResult.rows.forEach(fk => {
        console.log(`   - ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
      });
    } else {
      console.log('❌ Không có foreign keys nào');
    }

    console.log('\n✅ KIỂM TRA HOÀN TẤT!');

  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra database:', error);
  }
}

// Chạy kiểm tra
checkAllTables();
