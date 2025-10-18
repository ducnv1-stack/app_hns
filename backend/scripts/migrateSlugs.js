/**
 * Migration script to generate slugs for existing tours
 */

const { getClient } = require('../config/database');
const { generateSlug } = require('../utils/slugGenerator');

class SlugMigration {
  constructor() {
    this.client = null;
  }

  async connect() {
    this.client = await getClient();
    console.log('✅ Connected to database');
  }

  async disconnect() {
    if (this.client) {
      await this.client.release();
      console.log('✅ Disconnected from database');
    }
  }

  /**
   * Generate slug for a tour name
   */
  generateSlugFromName(name, id) {
    return generateSlug(name, id);
  }

  /**
   * Check if slug already exists
   */
  async slugExists(slug, excludeId = null) {
    const query = excludeId 
      ? 'SELECT id FROM services WHERE slug = $1 AND id != $2'
      : 'SELECT id FROM services WHERE slug = $1';
    
    const params = excludeId ? [slug, excludeId] : [slug];
    const result = await this.client.query(query, params);
    
    return result.rows.length > 0;
  }

  /**
   * Generate unique slug for a tour
   */
  async generateUniqueSlug(name, id) {
    let baseSlug = this.generateSlugFromName(name, id);
    let slug = baseSlug;
    let counter = 1;

    while (await this.slugExists(slug, id)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  /**
   * Update slug for a single tour
   */
  async updateTourSlug(tourId, name) {
    try {
      const slug = await this.generateUniqueSlug(name, tourId);
      
      await this.client.query(
        'UPDATE services SET slug = $1 WHERE id = $2',
        [slug, tourId]
      );
      
      console.log(`✅ Updated slug for tour ${tourId}: ${slug}`);
      return slug;
    } catch (error) {
      console.error(`❌ Error updating slug for tour ${tourId}:`, error.message);
      throw error;
    }
  }

  /**
   * Migrate all tours without slugs
   */
  async migrateAllTours() {
    try {
      console.log('🔄 Starting slug migration...');

      // Get all tours without slugs or with empty slugs
      const query = `
        SELECT id, name, slug 
        FROM services 
        WHERE service_type = 'TOUR' 
        AND (slug IS NULL OR slug = '')
        ORDER BY id ASC
      `;
      
      const result = await this.client.query(query);
      const tours = result.rows;
      
      console.log(`📊 Found ${tours.length} tours without slugs`);

      if (tours.length === 0) {
        console.log('✅ All tours already have slugs');
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (const tour of tours) {
        try {
          await this.updateTourSlug(tour.id, tour.name);
          successCount++;
        } catch (error) {
          console.error(`❌ Failed to update tour ${tour.id}:`, error.message);
          errorCount++;
        }
      }

      console.log(`\n📈 Migration Summary:`);
      console.log(`✅ Successfully updated: ${successCount} tours`);
      console.log(`❌ Failed to update: ${errorCount} tours`);
      console.log(`📊 Total processed: ${tours.length} tours`);

    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  /**
   * Verify all tours have slugs
   */
  async verifySlugs() {
    try {
      const query = `
        SELECT id, name, slug 
        FROM services 
        WHERE service_type = 'TOUR'
        ORDER BY id ASC
      `;
      
      const result = await this.client.query(query);
      const tours = result.rows;
      
      console.log('\n🔍 Verifying slugs...');
      
      let validSlugs = 0;
      let invalidSlugs = 0;

      for (const tour of tours) {
        if (tour.slug && tour.slug.trim() !== '') {
          console.log(`✅ Tour ${tour.id}: ${tour.slug}`);
          validSlugs++;
        } else {
          console.log(`❌ Tour ${tour.id}: No slug`);
          invalidSlugs++;
        }
      }

      console.log(`\n📊 Verification Summary:`);
      console.log(`✅ Valid slugs: ${validSlugs}`);
      console.log(`❌ Invalid slugs: ${invalidSlugs}`);
      console.log(`📊 Total tours: ${tours.length}`);

      return invalidSlugs === 0;
    } catch (error) {
      console.error('❌ Verification failed:', error);
      throw error;
    }
  }

  /**
   * Show current slug status
   */
  async showSlugStatus() {
    try {
      const query = `
        SELECT 
          id, 
          name, 
          slug,
          CASE 
            WHEN slug IS NULL OR slug = '' THEN 'Missing'
            ELSE 'Present'
          END as status
        FROM services 
        WHERE service_type = 'TOUR'
        ORDER BY id ASC
      `;
      
      const result = await this.client.query(query);
      const tours = result.rows;
      
      console.log('\n📋 Current Slug Status:');
      console.log('ID | Name | Slug | Status');
      console.log('---|------|------|--------');
      
      for (const tour of tours) {
        const slug = tour.slug || 'N/A';
        const name = tour.name.length > 30 ? tour.name.substring(0, 30) + '...' : tour.name;
        console.log(`${tour.id} | ${name} | ${slug} | ${tour.status}`);
      }
      
      const missingCount = tours.filter(t => t.status === 'Missing').length;
      const presentCount = tours.filter(t => t.status === 'Present').length;
      
      console.log(`\n📊 Summary: ${presentCount} with slugs, ${missingCount} missing slugs`);
      
    } catch (error) {
      console.error('❌ Failed to show status:', error);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const migration = new SlugMigration();
  
  try {
    await migration.connect();
    
    // Show current status
    await migration.showSlugStatus();
    
    // Ask user if they want to proceed
    console.log('\n❓ Do you want to proceed with migration? (This will update all tours without slugs)');
    console.log('   Run: node migrateSlugs.js --migrate');
    console.log('   Or: node migrateSlugs.js --verify');
    
    const args = process.argv.slice(2);
    
    if (args.includes('--migrate')) {
      await migration.migrateAllTours();
      await migration.verifySlugs();
    } else if (args.includes('--verify')) {
      await migration.verifySlugs();
    } else {
      console.log('\n💡 Usage:');
      console.log('   node migrateSlugs.js --migrate  # Run migration');
      console.log('   node migrateSlugs.js --verify   # Verify slugs');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await migration.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = SlugMigration;
