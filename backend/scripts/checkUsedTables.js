const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

/**
 * Script để kiểm tra các bảng nào đang được sử dụng trong hệ thống
 */
class TableUsageChecker {
  constructor() {
    this.allTables = [];
    this.usedTables = new Set();
    this.unusedTables = new Set();
    this.tableUsageCount = {};
  }

  /**
   * Lấy danh sách tất cả tables
   */
  async getAllTables() {
    try {
      const result = await query(`
        SELECT table_name
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      
      this.allTables = result.rows.map(row => row.table_name);
      console.log(`📊 Found ${this.allTables.length} tables in database`);
      
      return this.allTables;
    } catch (error) {
      console.error('❌ Error getting tables:', error.message);
      return [];
    }
  }

  /**
   * Scan tất cả files trong backend để tìm SQL queries
   */
  async scanBackendFiles() {
    console.log('🔍 Scanning backend files for SQL queries...\n');
    
    const backendDir = path.join(__dirname, '..');
    const files = this.getAllFiles(backendDir);
    
    console.log(`📁 Scanning ${files.length} files...`);
    
    files.forEach(file => {
      if (this.shouldScanFile(file)) {
        this.scanFile(file);
      }
    });
  }

  /**
   * Lấy tất cả files trong directory
   */
  getAllFiles(dir) {
    let files = [];
    
    try {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !this.shouldSkipDirectory(item)) {
          files = files.concat(this.getAllFiles(fullPath));
        } else if (stat.isFile() && this.shouldScanFile(fullPath)) {
          files.push(fullPath);
        }
      });
    } catch (error) {
      // Skip files that can't be read
    }
    
    return files;
  }

  /**
   * Kiểm tra có nên skip directory không
   */
  shouldSkipDirectory(dirName) {
    const skipDirs = ['node_modules', '.git', 'logs', 'uploads', 'dist'];
    return skipDirs.includes(dirName);
  }

  /**
   * Kiểm tra có nên scan file không
   */
  shouldScanFile(filePath) {
    const ext = path.extname(filePath);
    const allowedExts = ['.js', '.jsx', '.ts', '.tsx', '.sql'];
    return allowedExts.includes(ext);
  }

  /**
   * Scan file để tìm table references
   */
  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(path.join(__dirname, '..'), filePath);
      
      // Tìm các pattern SQL
      const patterns = [
        /FROM\s+(\w+)/gi,           // FROM table_name
        /JOIN\s+(\w+)/gi,           // JOIN table_name
        /UPDATE\s+(\w+)/gi,         // UPDATE table_name
        /INSERT\s+INTO\s+(\w+)/gi,  // INSERT INTO table_name
        /DELETE\s+FROM\s+(\w+)/gi,  // DELETE FROM table_name
        /TABLE\s+(\w+)/gi,          // TABLE table_name
        /'\s*(\w+)\s*'/gi,          // 'table_name' in strings
        /`\s*(\w+)\s*`/gi,          // `table_name` in backticks
        /"\s*(\w+)\s*"/gi           // "table_name" in quotes
      ];
      
      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const tableName = match[1];
          if (this.allTables.includes(tableName)) {
            this.usedTables.add(tableName);
            this.tableUsageCount[tableName] = (this.tableUsageCount[tableName] || 0) + 1;
          }
        }
      });
      
    } catch (error) {
      // Skip files that can't be read
    }
  }

  /**
   * Kiểm tra tables có data không
   */
  async checkTableData() {
    console.log('\n📊 Checking which tables have data...\n');
    
    const tableStats = {};
    
    for (const tableName of this.allTables) {
      try {
        const result = await query(`SELECT COUNT(*) as count FROM ${tableName}`);
        const count = parseInt(result.rows[0].count);
        tableStats[tableName] = count;
        
        if (count > 0) {
          console.log(`✅ ${tableName}: ${count} records`);
        } else {
          console.log(`⚠️  ${tableName}: 0 records (EMPTY)`);
        }
      } catch (error) {
        console.log(`❌ ${tableName}: Error checking - ${error.message}`);
        tableStats[tableName] = 'ERROR';
      }
    }
    
    return tableStats;
  }

  /**
   * Kiểm tra tables được sử dụng trong models
   */
  async checkModels() {
    console.log('\n📁 Checking models directory...\n');
    
    const modelsDir = path.join(__dirname, '..', 'models');
    
    try {
      const modelFiles = fs.readdirSync(modelsDir);
      
      modelFiles.forEach(file => {
        if (file.endsWith('.js')) {
          console.log(`📄 Model: ${file}`);
          const filePath = path.join(modelsDir, file);
          this.scanFile(filePath);
        }
      });
    } catch (error) {
      console.log('⚠️  Models directory not found or error reading');
    }
  }

  /**
   * Kiểm tra tables được sử dụng trong routes
   */
  async checkRoutes() {
    console.log('\n🛣️  Checking routes directory...\n');
    
    const routesDir = path.join(__dirname, '..', 'routes');
    
    try {
      const routeFiles = fs.readdirSync(routesDir);
      
      routeFiles.forEach(file => {
        if (file.endsWith('.js')) {
          console.log(`📄 Route: ${file}`);
          const filePath = path.join(routesDir, file);
          this.scanFile(filePath);
        }
      });
      
      // Check admin routes
      const adminDir = path.join(routesDir, 'admin');
      if (fs.existsSync(adminDir)) {
        const adminFiles = fs.readdirSync(adminDir);
        adminFiles.forEach(file => {
          if (file.endsWith('.js')) {
            console.log(`📄 Admin Route: ${file}`);
            const filePath = path.join(adminDir, file);
            this.scanFile(filePath);
          }
        });
      }
    } catch (error) {
      console.log('⚠️  Routes directory not found or error reading');
    }
  }

  /**
   * Phân tích kết quả
   */
  analyzeResults(tableStats) {
    console.log('\n📊 ANALYSIS RESULTS:\n');
    
    // Xác định unused tables
    this.unusedTables = new Set(this.allTables.filter(table => !this.usedTables.has(table)));
    
    console.log('🎯 TABLES USED IN CODE:');
    console.log('=' .repeat(50));
    const sortedUsed = Array.from(this.usedTables).sort((a, b) => 
      (this.tableUsageCount[b] || 0) - (this.tableUsageCount[a] || 0)
    );
    
    sortedUsed.forEach(table => {
      const count = this.tableUsageCount[table] || 0;
      const records = tableStats[table];
      const status = records > 0 ? '✅ HAS DATA' : '⚠️  EMPTY';
      console.log(`  ${table}: ${count} references, ${records} records (${status})`);
    });
    
    console.log(`\n📊 Total used tables: ${this.usedTables.size}`);
    
    console.log('\n❌ TABLES NOT USED IN CODE:');
    console.log('=' .repeat(50));
    this.unusedTables.forEach(table => {
      const records = tableStats[table];
      const status = records > 0 ? '⚠️  HAS DATA BUT NOT USED' : '🗑️  EMPTY AND NOT USED';
      console.log(`  ${table}: ${records} records (${status})`);
    });
    
    console.log(`\n📊 Total unused tables: ${this.unusedTables.size}`);
    
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('=' .repeat(50));
    
    const emptyUnused = Array.from(this.unusedTables).filter(table => tableStats[table] === 0);
    const dataUnused = Array.from(this.unusedTables).filter(table => tableStats[table] > 0);
    
    if (emptyUnused.length > 0) {
      console.log('\n🗑️  SAFE TO DELETE (Empty and unused):');
      emptyUnused.forEach(table => console.log(`  - ${table}`));
    }
    
    if (dataUnused.length > 0) {
      console.log('\n⚠️  REVIEW NEEDED (Has data but unused in code):');
      dataUnused.forEach(table => console.log(`  - ${table}`));
    }
    
    console.log(`\n📈 OPTIMIZATION POTENTIAL:`);
    console.log(`   Current tables: ${this.allTables.length}`);
    console.log(`   Used tables: ${this.usedTables.size}`);
    console.log(`   Unused tables: ${this.unusedTables.size}`);
    console.log(`   Reduction possible: ${this.unusedTables.size} tables (${Math.round(this.unusedTables.size / this.allTables.length * 100)}%)`);
  }

  /**
   * Chạy kiểm tra hoàn chỉnh
   */
  async runFullCheck() {
    try {
      console.log('🚀 Starting table usage analysis...\n');
      
      await this.getAllTables();
      await this.scanBackendFiles();
      await this.checkModels();
      await this.checkRoutes();
      const tableStats = await this.checkTableData();
      
      this.analyzeResults(tableStats);
      
      console.log('\n✅ Table usage analysis completed!');
      
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
    } finally {
      process.exit(0);
    }
  }
}

// Run analysis if this file is executed directly
if (require.main === module) {
  const checker = new TableUsageChecker();
  checker.runFullCheck();
}

module.exports = TableUsageChecker;
