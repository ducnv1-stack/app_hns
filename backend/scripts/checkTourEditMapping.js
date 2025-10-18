const { query } = require('../config/database');

/**
 * Script để kiểm tra mapping giữa giao diện Tour Edit và database tables
 */
class TourEditMappingChecker {
  constructor() {
    this.tables = [];
    this.mapping = {
      tourInfo: {},
      hotelInfo: {},
      flightInfo: {}
    };
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
      
      this.tables = result.rows.map(row => row.table_name);
      console.log(`📊 Found ${this.tables.length} tables in database`);
      
      return this.tables;
    } catch (error) {
      console.error('❌ Error getting tables:', error.message);
      return [];
    }
  }

  /**
   * Kiểm tra cấu trúc các bảng liên quan đến tour
   */
  async checkTourRelatedTables() {
    console.log('\n🔍 Checking tour-related tables structure...\n');
    
    const tourTables = ['services', 'service_details_tour', 'service_variants', 'service_images', 'service_availabilities'];
    
    for (const tableName of tourTables) {
      if (this.tables.includes(tableName)) {
        try {
          const result = await query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = $1
            ORDER BY ordinal_position
          `, [tableName]);
          
          console.log(`📋 Table: ${tableName}`);
          console.log(`   Columns (${result.rows.length}):`);
          result.rows.forEach(col => {
            console.log(`     - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
          });
          console.log('');
          
        } catch (error) {
          console.log(`   ❌ Error checking ${tableName}: ${error.message}`);
        }
      } else {
        console.log(`⚠️  Table ${tableName} not found in database`);
      }
    }
  }

  /**
   * Kiểm tra cấu trúc các bảng liên quan đến hotel
   */
  async checkHotelRelatedTables() {
    console.log('\n🏨 Checking hotel-related tables structure...\n');
    
    const hotelTables = ['service_details_hotel', 'service_details_hotel_room', 'roomtypes', 'providers'];
    
    for (const tableName of hotelTables) {
      if (this.tables.includes(tableName)) {
        try {
          const result = await query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = $1
            ORDER BY ordinal_position
          `, [tableName]);
          
          console.log(`📋 Table: ${tableName}`);
          console.log(`   Columns (${result.rows.length}):`);
          result.rows.forEach(col => {
            console.log(`     - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
          });
          console.log('');
          
        } catch (error) {
          console.log(`   ❌ Error checking ${tableName}: ${error.message}`);
        }
      } else {
        console.log(`⚠️  Table ${tableName} not found in database`);
      }
    }
  }

  /**
   * Kiểm tra cấu trúc các bảng liên quan đến flight
   */
  async checkFlightRelatedTables() {
    console.log('\n✈️ Checking flight-related tables structure...\n');
    
    const flightTables = ['service_details_flight', 'routes', 'airports'];
    
    for (const tableName of flightTables) {
      if (this.tables.includes(tableName)) {
        try {
          const result = await query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = $1
            ORDER BY ordinal_position
          `, [tableName]);
          
          console.log(`📋 Table: ${tableName}`);
          console.log(`   Columns (${result.rows.length}):`);
          result.rows.forEach(col => {
            console.log(`     - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
          });
          console.log('');
          
        } catch (error) {
          console.log(`   ❌ Error checking ${tableName}: ${error.message}`);
        }
      } else {
        console.log(`⚠️  Table ${tableName} not found in database`);
      }
    }
  }

  /**
   * Phân tích mapping giữa UI fields và database columns
   */
  analyzeMapping() {
    console.log('\n🎯 MAPPING ANALYSIS:\n');
    
    // Tour Info Section Mapping
    console.log('📝 TOUR INFO SECTION MAPPING:');
    console.log('=' .repeat(50));
    
    const tourInfoMapping = {
      'Tên tour': 'services.name',
      'Loại hình': 'services.service_type',
      'Trạng thái': 'services.status',
      'Số ngày': 'service_details_tour.duration_days',
      'Quốc gia': 'service_details_tour.country',
      'Địa điểm': 'services.metadata.location (JSON)',
      'Giá cơ bản': 'service_variants.price',
      'Loại tiền tệ': 'service_variants.currency',
      'Số người tối thiểu': 'service_details_tour.min_participants',
      'Số người tối đa': 'service_details_tour.max_participants',
      'Mô tả ngắn': 'services.short_description',
      'Mô tả chi tiết': 'services.description',
      'Lịch trình': 'service_details_tour.itinerary (JSON)'
    };
    
    Object.entries(tourInfoMapping).forEach(([field, mapping]) => {
      console.log(`  ✅ ${field} → ${mapping}`);
    });
    
    // Hotel Info Section Mapping
    console.log('\n🏨 HOTEL INFO SECTION MAPPING:');
    console.log('=' .repeat(50));
    
    const hotelInfoMapping = {
      'Tên khách sạn': 'service_details_hotel.hotel_name',
      'Địa chỉ khách sạn': 'service_details_hotel.hotel_address',
      'Sao đánh giá': 'service_details_hotel.star_rating',
      'Loại phòng': 'service_details_hotel.room_type',
      'Loại giường': 'service_details_hotel.bed_type',
      'Diện tích phòng': 'service_details_hotel.room_size',
      'Số người tối đa': 'service_details_hotel.max_occupancy',
      'Giờ check-in': 'service_details_hotel.check_in_time',
      'Giờ check-out': 'service_details_hotel.check_out_time',
      'Tiện nghi': 'service_details_hotel.amenities (JSON)'
    };
    
    Object.entries(hotelInfoMapping).forEach(([field, mapping]) => {
      console.log(`  ✅ ${field} → ${mapping}`);
    });
    
    // Flight Info Section Mapping
    console.log('\n✈️ FLIGHT INFO SECTION MAPPING:');
    console.log('=' .repeat(50));
    
    const flightInfoMapping = {
      'Hãng hàng không': 'service_details_flight.airline',
      'Số hiệu chuyến bay': 'service_details_flight.flight_number',
      'Sân bay đi': 'routes.origin_airport_id → airports.name',
      'Sân bay đến': 'routes.dest_airport_id → airports.name',
      'Thời gian đi': 'service_availabilities.start_datetime',
      'Thời gian đến': 'service_availabilities.end_datetime',
      'Loại máy bay': 'service_details_flight.aircraft_type (missing)',
      'Hành lý cho phép': 'service_details_flight.baggage_allowance (missing)',
      'Hạng ghế': 'service_details_flight.cabin_classes (JSON)'
    };
    
    Object.entries(flightInfoMapping).forEach(([field, mapping]) => {
      console.log(`  ✅ ${field} → ${mapping}`);
    });
  }

  /**
   * Kiểm tra các trường bị thiếu
   */
  checkMissingFields() {
    console.log('\n⚠️  MISSING FIELDS ANALYSIS:\n');
    
    console.log('🔍 Fields in UI but missing in database:');
    console.log('=' .repeat(50));
    
    const missingFields = [
      'service_details_flight.aircraft_type',
      'service_details_flight.baggage_allowance',
      'service_details_hotel.aircraft_type',
      'service_details_hotel.baggage_allowance'
    ];
    
    missingFields.forEach(field => {
      console.log(`  ❌ ${field} - Not found in database schema`);
    });
    
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('=' .repeat(50));
    console.log('1. Add missing columns to service_details_flight table');
    console.log('2. Add missing columns to service_details_hotel table');
    console.log('3. Update API endpoints to handle new fields');
    console.log('4. Update frontend validation for new fields');
  }

  /**
   * Kiểm tra data consistency
   */
  async checkDataConsistency() {
    console.log('\n📊 DATA CONSISTENCY CHECK:\n');
    
    try {
      // Check if tour 12 exists and has related data
      const tourResult = await query('SELECT * FROM services WHERE id = 12');
      
      if (tourResult.rows.length > 0) {
        const tour = tourResult.rows[0];
        console.log('✅ Tour 12 exists in services table');
        console.log(`   Name: ${tour.name}`);
        console.log(`   Type: ${tour.service_type}`);
        console.log(`   Status: ${tour.status}`);
        
        // Check tour details
        const detailsResult = await query('SELECT * FROM service_details_tour WHERE service_id = 12');
        if (detailsResult.rows.length > 0) {
          const details = detailsResult.rows[0];
          console.log('✅ Tour details exist');
          console.log(`   Duration: ${details.duration_days} days`);
          console.log(`   Country: ${details.country}`);
        } else {
          console.log('⚠️  No tour details found');
        }
        
        // Check variants
        const variantsResult = await query('SELECT * FROM service_variants WHERE service_id = 12');
        console.log(`✅ Found ${variantsResult.rows.length} variants`);
        
        // Check images
        const imagesResult = await query('SELECT * FROM service_images WHERE service_id = 12');
        console.log(`✅ Found ${imagesResult.rows.length} images`);
        
      } else {
        console.log('❌ Tour 12 not found in services table');
      }
      
    } catch (error) {
      console.error('❌ Error checking data consistency:', error.message);
    }
  }

  /**
   * Chạy kiểm tra hoàn chỉnh
   */
  async runFullCheck() {
    try {
      console.log('🚀 Starting Tour Edit Mapping Analysis...\n');
      
      await this.getAllTables();
      await this.checkTourRelatedTables();
      await this.checkHotelRelatedTables();
      await this.checkFlightRelatedTables();
      this.analyzeMapping();
      this.checkMissingFields();
      await this.checkDataConsistency();
      
      console.log('\n✅ Tour Edit Mapping Analysis completed!');
      
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
    } finally {
      process.exit(0);
    }
  }
}

// Run analysis if this file is executed directly
if (require.main === module) {
  const checker = new TourEditMappingChecker();
  checker.runFullCheck();
}

module.exports = TourEditMappingChecker;
