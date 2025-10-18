const { query } = require('../config/database');

/**
 * Script để phân tích chi tiết cấu trúc database HNS_Booking_Tour
 */
class DatabaseAnalyzer {
  constructor() {
    this.tables = [];
    this.coreTables = [];
    this.optionalTables = [];
  }

  /**
   * Lấy danh sách tất cả tables với thông tin chi tiết
   */
  async getAllTables() {
    try {
      console.log('🔍 Analyzing database structure...\n');
      
      const result = await query(`
        SELECT 
          table_name,
          table_type,
          (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
        FROM information_schema.tables t
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      
      this.tables = result.rows;
      
      console.log(`📊 Found ${this.tables.length} tables in database:`);
      console.log('=' .repeat(60));
      
      this.tables.forEach((table, index) => {
        console.log(`${index + 1}. ${table.table_name} (${table.column_count} columns)`);
      });
      
      return this.tables;
    } catch (error) {
      console.error('❌ Error getting tables:', error.message);
      return [];
    }
  }

  /**
   * Phân loại tables thành core và optional
   */
  categorizeTables() {
    console.log('\n📋 Categorizing tables...\n');
    
    // Core tables - cần thiết cho hệ thống booking
    const coreTableNames = [
      'users', 'parties', 'roles', 'user_roles',  // User management
      'services', 'service_details_tour', 'service_variants', 'service_images', 'service_availabilities', // Services
      'bookings', 'booking_items', 'booking_participants', // Bookings
      'payments', 'payment_transactions' // Payments
    ];
    
    this.coreTables = this.tables.filter(table => 
      coreTableNames.includes(table.table_name)
    );
    
    this.optionalTables = this.tables.filter(table => 
      !coreTableNames.includes(table.table_name)
    );
    
    console.log('🎯 CORE TABLES (Essential for booking system):');
    console.log('-' .repeat(50));
    this.coreTables.forEach((table, index) => {
      console.log(`${index + 1}. ${table.table_name} (${table.column_count} columns)`);
    });
    
    console.log(`\n📊 Total core tables: ${this.coreTables.length}`);
    
    console.log('\n⚠️  OPTIONAL/EXTRA TABLES:');
    console.log('-' .repeat(50));
    this.optionalTables.forEach((table, index) => {
      console.log(`${index + 1}. ${table.table_name} (${table.column_count} columns)`);
    });
    
    console.log(`\n📊 Total optional tables: ${this.optionalTables.length}`);
  }

  /**
   * Phân tích chi tiết từng optional table
   */
  async analyzeOptionalTables() {
    console.log('\n🔍 Analyzing optional tables...\n');
    
    for (const table of this.optionalTables) {
      try {
        console.log(`📋 Table: ${table.table_name}`);
        
        // Get column details
        const columnsResult = await query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = $1
          ORDER BY ordinal_position
        `, [table.table_name]);
        
        console.log(`   Columns (${columnsResult.rows.length}):`);
        columnsResult.rows.forEach(col => {
          console.log(`     - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
        });
        
        // Get record count
        const countResult = await query(`SELECT COUNT(*) as count FROM ${table.table_name}`);
        const recordCount = countResult.rows[0].count;
        console.log(`   Records: ${recordCount}`);
        
        // Check if table is being used
        if (recordCount === '0') {
          console.log('   ⚠️  EMPTY TABLE - Consider removing');
        } else if (parseInt(recordCount) < 10) {
          console.log('   ⚠️  LOW USAGE - Consider if needed');
        } else {
          console.log('   ✅ Has data - May be in use');
        }
        
        console.log('');
        
      } catch (error) {
        console.log(`   ❌ Error analyzing ${table.table_name}: ${error.message}`);
      }
    }
  }

  /**
   * Kiểm tra foreign key relationships
   */
  async checkRelationships() {
    console.log('\n🔗 Checking table relationships...\n');
    
    try {
      const result = await query(`
        SELECT
          tc.table_name,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        ORDER BY tc.table_name, kcu.column_name
      `);
      
      console.log(`🔗 Found ${result.rows.length} foreign key relationships:`);
      console.log('-' .repeat(80));
      
      result.rows.forEach((fk, index) => {
        console.log(`${index + 1}. ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
      });
      
      // Group by table
      const relationshipsByTable = {};
      result.rows.forEach(fk => {
        if (!relationshipsByTable[fk.table_name]) {
          relationshipsByTable[fk.table_name] = [];
        }
        relationshipsByTable[fk.table_name].push(fk);
      });
      
      console.log('\n📊 Relationships by table:');
      Object.entries(relationshipsByTable).forEach(([table, fks]) => {
        console.log(`\n${table}:`);
        fks.forEach(fk => {
          console.log(`  → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
        });
      });
      
    } catch (error) {
      console.log('❌ Error checking relationships:', error.message);
    }
  }

  /**
   * Đề xuất tối ưu hóa
   */
  suggestOptimizations() {
    console.log('\n💡 OPTIMIZATION SUGGESTIONS:\n');
    
    console.log('🎯 ESSENTIAL TABLES (Keep these):');
    this.coreTables.forEach(table => {
      console.log(`  ✅ ${table.table_name} - Core functionality`);
    });
    
    console.log('\n⚠️  TABLES TO REVIEW:');
    this.optionalTables.forEach(table => {
      console.log(`  ❓ ${table.table_name} - Check if needed`);
    });
    
    console.log('\n🔧 RECOMMENDATIONS:');
    console.log('1. Review each optional table to see if it\'s actually used');
    console.log('2. Consider consolidating similar tables');
    console.log('3. Remove unused tables to simplify database');
    console.log('4. Document the purpose of each remaining table');
    
    console.log('\n📊 CURRENT STATS:');
    console.log(`   Total tables: ${this.tables.length}`);
    console.log(`   Core tables: ${this.coreTables.length}`);
    console.log(`   Optional tables: ${this.optionalTables.length}`);
    console.log(`   Reduction potential: ${this.optionalTables.length} tables`);
  }

  /**
   * Chạy phân tích hoàn chỉnh
   */
  async runFullAnalysis() {
    try {
      await this.getAllTables();
      this.categorizeTables();
      await this.analyzeOptionalTables();
      await this.checkRelationships();
      this.suggestOptimizations();
      
      console.log('\n✅ Database analysis completed!');
      
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
    } finally {
      process.exit(0);
    }
  }
}

// Run analysis if this file is executed directly
if (require.main === module) {
  const analyzer = new DatabaseAnalyzer();
  analyzer.runFullAnalysis();
}

module.exports = DatabaseAnalyzer;
