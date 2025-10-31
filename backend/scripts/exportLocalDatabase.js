const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Database configuration
const localDbConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '1234',
  database: 'HNS_Booking_Tour'
};

// Export directory
const exportDir = path.join(__dirname, '../exports');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

async function exportDatabase() {
  console.log('🚀 Starting database export from local PostgreSQL...\n');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  try {
    // 1. Export schema only
    console.log('1️⃣ Exporting database schema...');
    const schemaFile = path.join(exportDir, `schema_${timestamp}.sql`);
    await exportSchema(schemaFile);
    console.log(`✅ Schema exported to: ${schemaFile}\n`);
    
    // 2. Export data only
    console.log('2️⃣ Exporting database data...');
    const dataFile = path.join(exportDir, `data_${timestamp}.sql`);
    await exportData(dataFile);
    console.log(`✅ Data exported to: ${dataFile}\n`);
    
    // 3. Export everything (full backup)
    console.log('3️⃣ Creating full backup...');
    const fullFile = path.join(exportDir, `full_backup_${timestamp}.sql`);
    await exportFull(fullFile);
    console.log(`✅ Full backup created: ${fullFile}\n`);
    
    // 4. Create import script for Supabase
    console.log('4️⃣ Creating Supabase import script...');
    const importFile = path.join(exportDir, `supabase_import_${timestamp}.sql`);
    await createSupabaseImportScript(schemaFile, dataFile, importFile);
    console.log(`✅ Supabase import script created: ${importFile}\n`);
    
    console.log('🎉 Database export completed successfully!');
    console.log('\n📁 Files created:');
    console.log(`   - Schema: ${schemaFile}`);
    console.log(`   - Data: ${dataFile}`);
    console.log(`   - Full backup: ${fullFile}`);
    console.log(`   - Supabase import: ${importFile}`);
    console.log('\n📋 Next steps:');
    console.log('   1. Go to Supabase Dashboard → SQL Editor');
    console.log(`   2. Copy and paste content from: ${importFile}`);
    console.log('   3. Run the SQL script');
    console.log('   4. Test connection with: node scripts/testSupabaseConnection.js');
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

function exportSchema(outputFile) {
  return new Promise((resolve, reject) => {
    const command = `pg_dump -h ${localDbConfig.host} -U ${localDbConfig.user} -d ${localDbConfig.database} --schema-only --no-owner --no-privileges -f "${outputFile}"`;
    
    exec(command, { env: { PGPASSWORD: localDbConfig.password } }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Schema export failed: ${error.message}`));
        return;
      }
      if (stderr) {
        console.warn('⚠️ Schema export warnings:', stderr);
      }
      resolve();
    });
  });
}

function exportData(outputFile) {
  return new Promise((resolve, reject) => {
    const command = `pg_dump -h ${localDbConfig.host} -U ${localDbConfig.user} -d ${localDbConfig.database} --data-only --no-owner --no-privileges -f "${outputFile}"`;
    
    exec(command, { env: { PGPASSWORD: localDbConfig.password } }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Data export failed: ${error.message}`));
        return;
      }
      if (stderr) {
        console.warn('⚠️ Data export warnings:', stderr);
      }
      resolve();
    });
  });
}

function exportFull(outputFile) {
  return new Promise((resolve, reject) => {
    const command = `pg_dump -h ${localDbConfig.host} -U ${localDbConfig.user} -d ${localDbConfig.database} --no-owner --no-privileges -f "${outputFile}"`;
    
    exec(command, { env: { PGPASSWORD: localDbConfig.password } }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Full export failed: ${error.message}`));
        return;
      }
      if (stderr) {
        console.warn('⚠️ Full export warnings:', stderr);
      }
      resolve();
    });
  });
}

async function createSupabaseImportScript(schemaFile, dataFile, outputFile) {
  try {
    // Read schema and data files
    const schemaContent = fs.readFileSync(schemaFile, 'utf8');
    const dataContent = fs.readFileSync(dataFile, 'utf8');
    
    // Create Supabase-optimized import script
    const supabaseScript = `-- HNS Booking Tour - Supabase Import Script
-- Generated: ${new Date().toISOString()}
-- 
-- Instructions:
-- 1. Copy this entire script
-- 2. Go to Supabase Dashboard → SQL Editor
-- 3. Paste and run this script
-- 4. Verify tables and data were created successfully

-- ============================================
-- SCHEMA CREATION
-- ============================================

${schemaContent}

-- ============================================
-- DATA INSERTION
-- ============================================

${dataContent}

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check tables were created
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check data counts
SELECT 
  'services' as table_name, COUNT(*) as count FROM services
UNION ALL
SELECT 
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 
  'parties' as table_name, COUNT(*) as count FROM parties
UNION ALL
SELECT 
  'bookings' as table_name, COUNT(*) as count FROM bookings
UNION ALL
SELECT 
  'roles' as table_name, COUNT(*) as count FROM roles;

-- Check enums
SELECT 
  t.typname as enum_name,
  e.enumlabel as enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname LIKE '%_enum'
ORDER BY t.typname, e.enumsortorder;

-- ============================================
-- IMPORT COMPLETED
-- ============================================

SELECT 'HNS Database import completed successfully!' as status;
`;

    fs.writeFileSync(outputFile, supabaseScript);
  } catch (error) {
    throw new Error(`Failed to create Supabase import script: ${error.message}`);
  }
}

// Run export
if (require.main === module) {
  exportDatabase();
}

module.exports = exportDatabase;
