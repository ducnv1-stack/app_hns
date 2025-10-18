const { query, pool } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Script để kiểm tra kết nối database và dữ liệu
 */
class DatabaseChecker {
  constructor() {
    this.connectionStatus = null;
  }

  /**
   * Test database connection
   */
  async testConnection() {
    try {
      console.log('🔍 Testing database connection...');
      
      const result = await query('SELECT NOW() as current_time, version() as postgres_version');
      
      this.connectionStatus = 'CONNECTED';
      
      console.log('✅ Database connection successful!');
      console.log('📅 Current time:', result.rows[0].current_time);
      console.log('🐘 PostgreSQL version:', result.rows[0].postgres_version.split(' ')[0]);
      
      logger.info('Database connection test successful', {
        currentTime: result.rows[0].current_time,
        version: result.rows[0].postgres_version
      });
      
      return true;
    } catch (error) {
      this.connectionStatus = 'FAILED';
      
      console.log('❌ Database connection failed!');
      console.error('Error:', error.message);
      
      logger.error('Database connection test failed', error);
      
      return false;
    }
  }

  /**
   * Check database tables
   */
  async checkTables() {
    try {
      console.log('\n📊 Checking database tables...');
      
      const result = await query(`
        SELECT table_name, table_type
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      
      console.log(`✅ Found ${result.rows.length} tables:`);
      result.rows.forEach(row => {
        console.log(`  - ${row.table_name} (${row.table_type})`);
      });
      
      return result.rows;
    } catch (error) {
      console.log('❌ Failed to check tables');
      console.error('Error:', error.message);
      logger.error('Failed to check database tables', error);
      return [];
    }
  }

  /**
   * Check tour-related tables
   */
  async checkTourTables() {
    try {
      console.log('\n🏖️ Checking tour-related tables...');
      
      const tourTables = [
        'services',
        'service_details_tour', 
        'service_variants',
        'service_images',
        'service_availabilities'
      ];
      
      for (const tableName of tourTables) {
        try {
          const countResult = await query(`SELECT COUNT(*) as count FROM ${tableName}`);
          const count = countResult.rows[0].count;
          
          console.log(`  - ${tableName}: ${count} records`);
          
          if (count > 0 && tableName === 'services') {
            // Show sample data for services table
            const sampleResult = await query(`
              SELECT id, name, service_type, status, created_at 
              FROM ${tableName} 
              ORDER BY created_at DESC 
              LIMIT 3
            `);
            
            console.log(`    Sample data:`);
            sampleResult.rows.forEach(row => {
              console.log(`      ID: ${row.id}, Name: ${row.name}, Type: ${row.service_type}, Status: ${row.status}`);
            });
          }
        } catch (error) {
          console.log(`  - ${tableName}: Table not found or error - ${error.message}`);
        }
      }
    } catch (error) {
      console.log('❌ Failed to check tour tables');
      logger.error('Failed to check tour tables', error);
    }
  }

  /**
   * Check tour data specifically
   */
  async checkTourData() {
    try {
      console.log('\n🎯 Checking tour data...');
      
      // Check services with type TOUR
      const toursResult = await query(`
        SELECT s.id, s.name, s.service_type, s.status, s.created_at,
               t.duration_days, t.country, t.min_participants, t.max_participants
        FROM services s
        LEFT JOIN service_details_tour t ON s.id = t.service_id
        WHERE s.service_type = 'TOUR'
        ORDER BY s.created_at DESC
        LIMIT 10
      `);
      
      console.log(`✅ Found ${toursResult.rows.length} tours:`);
      
      if (toursResult.rows.length === 0) {
        console.log('⚠️ No tour data found in database');
        return [];
      }
      
      toursResult.rows.forEach((tour, index) => {
        console.log(`\n  Tour ${index + 1}:`);
        console.log(`    ID: ${tour.id}`);
        console.log(`    Name: ${tour.name}`);
        console.log(`    Type: ${tour.service_type}`);
        console.log(`    Status: ${tour.status}`);
        console.log(`    Duration: ${tour.duration_days} days`);
        console.log(`    Country: ${tour.country}`);
        console.log(`    Participants: ${tour.min_participants}-${tour.max_participants}`);
        console.log(`    Created: ${tour.created_at}`);
      });
      
      return toursResult.rows;
    } catch (error) {
      console.log('❌ Failed to check tour data');
      console.error('Error:', error.message);
      logger.error('Failed to check tour data', error);
      return [];
    }
  }

  /**
   * Check tour variants and pricing
   */
  async checkTourVariants() {
    try {
      console.log('\n💰 Checking tour variants and pricing...');
      
      const variantsResult = await query(`
        SELECT sv.id, sv.service_id, sv.variant_name, sv.price, sv.available_quantity,
               s.name as tour_name
        FROM service_variants sv
        JOIN services s ON sv.service_id = s.id
        WHERE s.service_type = 'TOUR'
        ORDER BY sv.price DESC
        LIMIT 10
      `);
      
      if (variantsResult.rows.length === 0) {
        console.log('⚠️ No tour variants found');
        return [];
      }
      
      console.log(`✅ Found ${variantsResult.rows.length} tour variants:`);
      
      variantsResult.rows.forEach((variant, index) => {
        console.log(`\n  Variant ${index + 1}:`);
        console.log(`    Tour: ${variant.tour_name}`);
        console.log(`    Variant: ${variant.variant_name}`);
        console.log(`    Price: ${variant.price} VND`);
        console.log(`    Available: ${variant.available_quantity}`);
      });
      
      return variantsResult.rows;
    } catch (error) {
      console.log('❌ Failed to check tour variants');
      logger.error('Failed to check tour variants', error);
      return [];
    }
  }

  /**
   * Check tour images
   */
  async checkTourImages() {
    try {
      console.log('\n🖼️ Checking tour images...');
      
      const imagesResult = await query(`
        SELECT si.id, si.service_id, si.image_url, si.is_primary,
               s.name as tour_name
        FROM service_images si
        JOIN services s ON si.service_id = s.id
        WHERE s.service_type = 'TOUR'
        ORDER BY si.is_primary DESC, si.sort_order ASC
        LIMIT 10
      `);
      
      if (imagesResult.rows.length === 0) {
        console.log('⚠️ No tour images found');
        return [];
      }
      
      console.log(`✅ Found ${imagesResult.rows.length} tour images:`);
      
      imagesResult.rows.forEach((image, index) => {
        console.log(`\n  Image ${index + 1}:`);
        console.log(`    Tour: ${image.tour_name}`);
        console.log(`    URL: ${image.image_url}`);
        console.log(`    Primary: ${image.is_primary ? 'Yes' : 'No'}`);
      });
      
      return imagesResult.rows;
    } catch (error) {
      console.log('❌ Failed to check tour images');
      logger.error('Failed to check tour images', error);
      return [];
    }
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats() {
    try {
      console.log('\n📈 Database Statistics:');
      
      const stats = {};
      
      // Count records in main tables
      const tables = ['services', 'service_details_tour', 'service_variants', 'service_images', 'service_availabilities'];
      
      for (const table of tables) {
        try {
          const result = await query(`SELECT COUNT(*) as count FROM ${table}`);
          stats[table] = parseInt(result.rows[0].count);
        } catch (error) {
          stats[table] = 'Error';
        }
      }
      
      console.log('📊 Table record counts:');
      Object.entries(stats).forEach(([table, count]) => {
        console.log(`  - ${table}: ${count} records`);
      });
      
      // Tour-specific stats
      try {
        const tourStatsResult = await query(`
          SELECT 
            COUNT(*) as total_tours,
            COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_tours,
            COUNT(CASE WHEN status = 'DRAFT' THEN 1 END) as draft_tours,
            COUNT(CASE WHEN status = 'INACTIVE' THEN 1 END) as inactive_tours
          FROM services 
          WHERE service_type = 'TOUR'
        `);
        
        const tourStats = tourStatsResult.rows[0];
        console.log('\n🏖️ Tour Statistics:');
        console.log(`  - Total tours: ${tourStats.total_tours}`);
        console.log(`  - Active tours: ${tourStats.active_tours}`);
        console.log(`  - Draft tours: ${tourStats.draft_tours}`);
        console.log(`  - Inactive tours: ${tourStats.inactive_tours}`);
        
        stats.tourStats = tourStats;
      } catch (error) {
        console.log('❌ Failed to get tour statistics');
      }
      
      return stats;
    } catch (error) {
      console.log('❌ Failed to get database statistics');
      logger.error('Failed to get database statistics', error);
      return {};
    }
  }

  /**
   * Run all checks
   */
  async runAllChecks() {
    console.log('🚀 Starting comprehensive database check...\n');
    
    try {
      // Test connection
      const connected = await this.testConnection();
      if (!connected) {
        console.log('❌ Cannot proceed without database connection');
        return;
      }
      
      // Check tables
      await this.checkTables();
      
      // Check tour-specific data
      await this.checkTourTables();
      await this.checkTourData();
      await this.checkTourVariants();
      await this.checkTourImages();
      
      // Get statistics
      await this.getDatabaseStats();
      
      console.log('\n✅ Database check completed successfully!');
      
      logger.info('Database check completed', {
        connectionStatus: this.connectionStatus,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.log('❌ Database check failed');
      console.error('Error:', error.message);
      logger.error('Database check failed', error);
    } finally {
      // Close connection pool
      await pool.end();
    }
  }
}

// Run checks if this file is executed directly
if (require.main === module) {
  const checker = new DatabaseChecker();
  checker.runAllChecks().then(() => {
    console.log('✅ Database check completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Database check failed:', error);
    process.exit(1);
  });
}

module.exports = DatabaseChecker;
