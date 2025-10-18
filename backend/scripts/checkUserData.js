/**
 * Script to check user data in database after creation
 */

const { getClient } = require('../config/database');

async function checkUserData() {
  const client = await getClient();
  
  try {
    console.log('🔍 Checking user data in database...\n');
    
    // 1. Check parties table
    console.log('📋 PARTIES TABLE:');
    const partiesResult = await client.query(`
      SELECT 
        id,
        party_type,
        full_name,
        email,
        phone_number,
        is_email_verified,
        created_at
      FROM parties 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log(`Found ${partiesResult.rows.length} parties:`);
    partiesResult.rows.forEach((party, index) => {
      console.log(`  ${index + 1}. ${party.full_name} (${party.email}) - ${party.party_type}`);
      console.log(`     Phone: ${party.phone_number || 'N/A'}`);
      console.log(`     Verified: ${party.is_email_verified}`);
      console.log(`     Created: ${party.created_at}`);
      console.log('');
    });
    
    // 2. Check users table
    console.log('👤 USERS TABLE:');
    const usersResult = await client.query(`
      SELECT 
        u.id,
        u.party_id,
        u.username,
        u.auth_provider,
        u.is_active,
        u.created_at,
        p.full_name,
        p.email
      FROM users u
      JOIN parties p ON u.party_id = p.id
      ORDER BY u.created_at DESC 
      LIMIT 5
    `);
    
    console.log(`Found ${usersResult.rows.length} users:`);
    usersResult.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.full_name} (${user.username})`);
      console.log(`     Party ID: ${user.party_id}`);
      console.log(`     Auth Provider: ${user.auth_provider}`);
      console.log(`     Active: ${user.is_active}`);
      console.log(`     Created: ${user.created_at}`);
      console.log('');
    });
    
    // 3. Check user_roles table
    console.log('🔐 USER_ROLES TABLE:');
    const userRolesResult = await client.query(`
      SELECT 
        ur.user_id,
        ur.role_id,
        r.role_name,
        p.full_name,
        p.email
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      JOIN users u ON ur.user_id = u.id
      JOIN parties p ON u.party_id = p.id
      ORDER BY ur.user_id DESC
    `);
    
    console.log(`Found ${userRolesResult.rows.length} user-role assignments:`);
    userRolesResult.rows.forEach((assignment, index) => {
      console.log(`  ${index + 1}. ${assignment.full_name} (${assignment.email})`);
      console.log(`     User ID: ${assignment.user_id}`);
      console.log(`     Role: ${assignment.role_name}`);
      console.log('');
    });
    
    // 4. Check roles table
    console.log('🎭 ROLES TABLE:');
    const rolesResult = await client.query(`
      SELECT id, role_name, description 
      FROM roles 
      ORDER BY id
    `);
    
    console.log(`Found ${rolesResult.rows.length} roles:`);
    rolesResult.rows.forEach((role, index) => {
      console.log(`  ${index + 1}. ${role.role_name} - ${role.description}`);
    });
    
    // 5. Summary
    console.log('\n📊 SUMMARY:');
    const totalParties = await client.query('SELECT COUNT(*) as count FROM parties');
    const totalUsers = await client.query('SELECT COUNT(*) as count FROM users');
    const totalUserRoles = await client.query('SELECT COUNT(*) as count FROM user_roles');
    const totalRoles = await client.query('SELECT COUNT(*) as count FROM roles');
    
    console.log(`  - Total Parties: ${totalParties.rows[0].count}`);
    console.log(`  - Total Users: ${totalUsers.rows[0].count}`);
    console.log(`  - Total User-Role Assignments: ${totalUserRoles.rows[0].count}`);
    console.log(`  - Total Roles: ${totalRoles.rows[0].count}`);
    
    // 6. Check latest created user
    console.log('\n🆕 LATEST CREATED USER:');
    const latestUser = await client.query(`
      SELECT 
        u.id as user_id,
        u.username,
        u.is_active,
        u.created_at as user_created,
        p.full_name,
        p.email,
        p.phone_number,
        r.role_name
      FROM users u
      JOIN parties p ON u.party_id = p.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      ORDER BY u.created_at DESC
      LIMIT 1
    `);
    
    if (latestUser.rows.length > 0) {
      const user = latestUser.rows[0];
      console.log(`  Name: ${user.full_name}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Phone: ${user.phone_number || 'N/A'}`);
      console.log(`  Username: ${user.username}`);
      console.log(`  Role: ${user.role_name || 'N/A'}`);
      console.log(`  Active: ${user.is_active}`);
      console.log(`  Created: ${user.user_created}`);
    }
    
    console.log('\n✅ User data check completed!');
    
  } catch (error) {
    console.error('❌ Error checking user data:', error);
  } finally {
    await client.release();
  }
}

// Run if called directly
if (require.main === module) {
  checkUserData();
}

module.exports = checkUserData;
