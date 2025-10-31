const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
  'routes/tours.js',
  'routes/bookings.js', 
  'routes/users.js',
  'routes/auth.js',
  'routes/payments.js',
  'routes/admin/tours.js',
  'routes/admin/users.js',
  'routes/admin/analytics.js',
  'routes/admin/variants.js',
  'models/Tour.js',
  'models/User.js',
  'models/Payment.js',
  'models/PaymentTransaction.js',
  'models/ProviderAccount.js',
  'services/variantService.js',
  'utils/databaseLogger.js'
];

function updateFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return false;
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace database imports
    const oldImport = "require('../config/database')";
    const newImport = "require('../config/database-supabase')";
    
    if (content.includes(oldImport)) {
      content = content.replace(new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newImport);
      
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Updated: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️ No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function updateAllFiles() {
  console.log('🔄 Updating all files to use Supabase...\n');
  
  let updatedCount = 0;
  
  filesToUpdate.forEach(filePath => {
    if (updateFile(filePath)) {
      updatedCount++;
    }
  });
  
  console.log(`\n🎉 Updated ${updatedCount} files to use Supabase!`);
  console.log('\n📋 Next steps:');
  console.log('   1. Test server: node server.js');
  console.log('   2. Test APIs: node scripts/testAnalyticsAPI.js');
  console.log('   3. Test frontend: npm run dev');
}

// Run update
if (require.main === module) {
  updateAllFiles();
}

module.exports = updateAllFiles;
