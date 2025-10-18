/**
 * Check roles in database
 */

const { getClient } = require('../config/database');

async function checkRoles() {
  const client = await getClient();
  
  try {
    console.log('🔍 Checking roles in database...\n');
    
    const result = await client.query(`
      SELECT id, role_name, description 
      FROM roles 
      ORDER BY id
    `);
    
    console.log(`Found ${result.rows.length} roles:`);
    result.rows.forEach((role, index) => {
      console.log(`  ${index + 1}. ID: ${role.id}, Name: '${role.role_name}', Description: '${role.description}'`);
    });
    
    // Check if USER role exists
    const userRole = result.rows.find(r => r.role_name === 'USER');
    if (userRole) {
      console.log('\n✅ USER role exists:', userRole);
    } else {
      console.log('\n❌ USER role does not exist!');
    }
    
    // Check if ADMIN role exists
    const adminRole = result.rows.find(r => r.role_name === 'ADMIN');
    if (adminRole) {
      console.log('✅ ADMIN role exists:', adminRole);
    } else {
      console.log('❌ ADMIN role does not exist!');
    }
    
  } catch (error) {
    console.error('❌ Error checking roles:', error);
  } finally {
    await client.release();
  }
}

// Run if called directly
if (require.main === module) {
  checkRoles();
}

module.exports = checkRoles;
