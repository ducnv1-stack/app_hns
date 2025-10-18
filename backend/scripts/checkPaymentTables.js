const pool = require('../config/database');

async function checkPaymentTables() {
  try {
    console.log('🔍 KIỂM TRA BẢNG PAYMENTS TRONG DATABASE...\n');

    // 1. Kiểm tra bảng payments
    console.log('📋 KIỂM TRA BẢNG: payments');
    const paymentsQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'payments'
      ORDER BY ordinal_position;
    `;
    const paymentsResult = await pool.query(paymentsQuery);

    if (paymentsResult.rows.length === 0) {
      console.log('❌ Bảng payments chưa tồn tại!');
      return;
    }

    console.log('✅ Bảng payments tồn tại với cấu trúc:');
    paymentsResult.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `(default: ${col.column_default})` : ''}`);
    });

    // 1.1. Kiểm tra bảng provider_accounts
    console.log('\n📋 KIỂM TRA BẢNG: provider_accounts');
    const providerAccountsQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'provider_accounts'
      ORDER BY ordinal_position;
    `;
    const providerAccountsResult = await pool.query(providerAccountsQuery);

    if (providerAccountsResult.rows.length === 0) {
      console.log('❌ Bảng provider_accounts chưa tồn tại!');
    } else {
      console.log('✅ Bảng provider_accounts tồn tại với cấu trúc:');
      providerAccountsResult.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `(default: ${col.column_default})` : ''}`);
      });
    }

    // 2. Kiểm tra bảng payment_transactions
    console.log('\n📋 KIỂM TRA BẢNG: payment_transactions');
    const transactionsQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'payment_transactions'
      ORDER BY ordinal_position;
    `;
    const transactionsResult = await pool.query(transactionsQuery);

    if (transactionsResult.rows.length === 0) {
      console.log('❌ Bảng payment_transactions chưa tồn tại!');
    } else {
      console.log('✅ Bảng payment_transactions tồn tại với cấu trúc:');
      transactionsResult.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `(default: ${col.column_default})` : ''}`);
      });
    }

    // 3. Kiểm tra bảng payment_methods
    console.log('\n📋 KIỂM TRA BẢNG: payment_methods');
    const methodsQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'payment_methods'
      ORDER BY ordinal_position;
    `;
    const methodsResult = await pool.query(methodsQuery);

    if (methodsResult.rows.length === 0) {
      console.log('❌ Bảng payment_methods chưa tồn tại!');
    } else {
      console.log('✅ Bảng payment_methods tồn tại với cấu trúc:');
      methodsResult.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `(default: ${col.column_default})` : ''}`);
      });
    }

    // 4. Kiểm tra indexes
    console.log('\n📊 KIỂM TRA INDEXES:');
    const indexesQuery = `
      SELECT
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE tablename LIKE 'payment%'
      ORDER BY tablename, indexname;
    `;
    const indexesResult = await pool.query(indexesQuery);

    if (indexesResult.rows.length === 0) {
      console.log('❌ Không tìm thấy indexes cho bảng payment!');
    } else {
      console.log('✅ Các indexes đã được tạo:');
      indexesResult.rows.forEach(idx => {
        console.log(`   - ${idx.indexname} trên ${idx.tablename}`);
      });
    }

    // 5. Kiểm tra foreign keys
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
      WHERE tc.table_name LIKE 'payment%' AND tc.constraint_type = 'FOREIGN KEY';
    `;
    const fkResult = await pool.query(fkQuery);

    if (fkResult.rows.length === 0) {
      console.log('❌ Không tìm thấy foreign keys!');
    } else {
      console.log('✅ Các foreign keys đã được tạo:');
      fkResult.rows.forEach(fk => {
        console.log(`   - ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
      });
    }

    // 6. Kiểm tra dữ liệu mẫu
    console.log('\n📈 KIỂM TRA DỮ LIỆU MẪU:');
    const sampleQuery = `
      SELECT
        (SELECT COUNT(*) FROM payments) as payments_count,
        (SELECT COUNT(*) FROM provider_accounts) as provider_accounts_count;
    `;
    const sampleResult = await pool.query(sampleQuery);
    const sample = sampleResult.rows[0];

    console.log(`   - Số bản ghi trong payments: ${sample.payments_count}`);
    console.log(`   - Số bản ghi trong provider_accounts: ${sample.provider_accounts_count}`);

    // 7. Hiển thị một vài bản ghi mẫu nếu có
    if (sample.payments_count > 0) {
      console.log('\n📝 DỮ LIỆU MẪU TRONG BẢNG payments:');
      const sampleDataQuery = `
        SELECT id, booking_id, amount, currency, payment_method, status, created_at
        FROM payments
        ORDER BY created_at DESC
        LIMIT 3;
      `;
      const sampleDataResult = await pool.query(sampleDataQuery);
      sampleDataResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. Payment ID ${row.id}: ${row.amount} ${row.currency} - ${row.status} (${row.payment_method})`);
      });
    }

    if (sample.provider_accounts_count > 0) {
      console.log('\n📝 DỮ LIỆU MẪU TRONG BẢNG provider_accounts:');
      const sampleProviderQuery = `
        SELECT id, provider_id, account_name, account_number, bank_name, currency, is_default
        FROM provider_accounts
        ORDER BY created_at DESC
        LIMIT 3;
      `;
      const sampleProviderResult = await pool.query(sampleProviderQuery);
      sampleProviderResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. Account ID ${row.id}: ${row.account_name} - ${row.account_number} (${row.bank_name}) ${row.is_default ? '[DEFAULT]' : ''}`);
      });
    }

    console.log('\n✅ KIỂM TRA HOÀN TẤT!');

  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra database:', error.message);
    console.error('Chi tiết lỗi:', error);
  } finally {
    pool.end();
  }
}

checkPaymentTables();
