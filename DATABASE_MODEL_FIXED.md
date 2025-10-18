# ✅ DATABASE MODEL - ĐÃ FIX HOÀN CHỈNH

## 🎯 Summary

**File:** `backend/models/Tour.js`

**Đã update:**
- ✅ `Tour.create()` - Multi-table INSERT
- ✅ `Tour.update()` - Multi-table UPDATE/INSERT
- ✅ Transaction support (BEGIN/COMMIT/ROLLBACK)

---

## ✅ Tour.create() - FIXED

### **Flow:**

```
BEGIN TRANSACTION
  ↓
1. INSERT INTO services
   → Get auto-generated ID
  ↓
2. INSERT INTO service_details_tour
   (if has tour data)
  ↓
3. INSERT INTO service_details_hotel
   (if has hotel data)
  ↓
4. INSERT INTO service_details_flight
   (if has flight data)
  ↓
COMMIT TRANSACTION
```

### **Code:**

```javascript
static async create(tourData) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 1. Insert services (main table)
    const serviceResult = await client.query(`
      INSERT INTO services (name, short_description, description, service_type, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, short_description, description, service_type, status]);
    
    const serviceId = serviceResult.rows[0].id; // ← Auto-generated
    
    // 2. Insert tour details (conditional)
    if (duration_days || country || itinerary) {
      await client.query(`
        INSERT INTO service_details_tour (...)
        VALUES ($1, $2, ...)
      `, [serviceId, ...]);
    }
    
    // 3. Insert hotel details (conditional)
    if (hotel_name || star_rating) {
      await client.query(`
        INSERT INTO service_details_hotel (...)
        VALUES ($1, $2, ...)
      `, [serviceId, ...]);
    }
    
    // 4. Insert flight details (conditional)
    if (airline || flight_number) {
      await client.query(`
        INSERT INTO service_details_flight (...)
        VALUES ($1, $2, ...)
      `, [serviceId, ...]);
    }
    
    await client.query('COMMIT');
    return serviceResult.rows[0];
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

---

## ✅ Tour.update() - FIXED

### **Flow:**

```
BEGIN TRANSACTION
  ↓
1. UPDATE services
   (if has service fields)
  ↓
2. UPDATE/INSERT service_details_tour
   - Check if exists
   - UPDATE if exists
   - INSERT if not exists
  ↓
3. UPDATE/INSERT service_details_hotel
   - Check if exists
   - UPDATE if exists
   - INSERT if not exists
  ↓
4. UPDATE/INSERT service_details_flight
   - Check if exists
   - UPDATE if exists
   - INSERT if not exists
  ↓
COMMIT TRANSACTION
```

### **Code:**

```javascript
static async update(tourId, updateData) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 1. Update services
    if (has service fields) {
      await client.query(`UPDATE services SET ... WHERE id = $1`, [tourId]);
    }
    
    // 2. Update/Insert tour details
    const checkTour = await client.query(
      'SELECT id FROM service_details_tour WHERE service_id = $1',
      [tourId]
    );
    
    if (checkTour.rows.length > 0) {
      // UPDATE existing
      await client.query(`UPDATE service_details_tour SET ... WHERE service_id = $1`, [tourId]);
    } else {
      // INSERT new
      await client.query(`INSERT INTO service_details_tour (...) VALUES (...)`, [...]);
    }
    
    // 3. Update/Insert hotel details (same pattern)
    // 4. Update/Insert flight details (same pattern)
    
    await client.query('COMMIT');
    return await this.findById(tourId);
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

---

## 📊 Database Tables

### **services (main table):**
```sql
id SERIAL PRIMARY KEY ← Auto-generated: 1, 2, 3, ...
name VARCHAR(255)
short_description TEXT
description TEXT
service_type VARCHAR(20)
status VARCHAR(20)
created_at TIMESTAMP
updated_at TIMESTAMP
```

### **service_details_tour:**
```sql
id SERIAL PRIMARY KEY ← Auto-generated
service_id INTEGER → services.id
duration_days INTEGER
country VARCHAR(100)
min_participants INTEGER
max_participants INTEGER
departure_date DATE
return_date DATE
itinerary JSONB
```

### **service_details_hotel:**
```sql
id SERIAL PRIMARY KEY ← Auto-generated
service_id INTEGER → services.id
hotel_name VARCHAR(255)
hotel_address TEXT
star_rating INTEGER
room_type VARCHAR(100)
bed_type VARCHAR(100)
room_size DECIMAL(10,2)
max_occupancy INTEGER
amenities JSONB
check_in_time TIME
check_out_time TIME
```

### **service_details_flight:**
```sql
id SERIAL PRIMARY KEY ← Auto-generated
service_id INTEGER → services.id
airline VARCHAR(100)
flight_number VARCHAR(50)
departure_airport VARCHAR(100)
arrival_airport VARCHAR(100)
departure_time TIME
arrival_time TIME
aircraft_type VARCHAR(100)
baggage_allowance VARCHAR(100)
seat_class VARCHAR(50)
```

---

## 🎯 Example Usage

### **Create Service:**

**Input:**
```javascript
await Tour.create({
  // Service fields
  name: "Đà Lạt - Nha Trang 4N3Đ",
  service_type: "TOUR",
  status: "DRAFT",
  
  // Tour fields
  duration_days: 4,
  country: "Việt Nam",
  
  // Hotel fields
  hotel_name: "Khách sạn ABC",
  star_rating: 4,
  
  // Flight fields
  airline: "Vietnam Airlines",
  flight_number: "VN123"
});
```

**Database Result:**

```sql
-- services
id: 15 (auto-generated)
name: "Đà Lạt - Nha Trang 4N3Đ"

-- service_details_tour
id: 1 (auto-generated)
service_id: 15
duration_days: 4

-- service_details_hotel
id: 1 (auto-generated)
service_id: 15
hotel_name: "Khách sạn ABC"

-- service_details_flight
id: 1 (auto-generated)
service_id: 15
airline: "Vietnam Airlines"
```

---

## ✅ Features

### **1. Transaction Safety:**
- ✅ BEGIN/COMMIT/ROLLBACK
- ✅ All-or-nothing (atomic)
- ✅ Data consistency

### **2. Conditional Insert:**
- ✅ Only insert if data exists
- ✅ Skip empty sections
- ✅ Flexible data entry

### **3. Auto-generated IDs:**
- ✅ PostgreSQL SERIAL
- ✅ Automatic increment
- ✅ No manual ID management

### **4. Update/Insert Logic:**
- ✅ Check if record exists
- ✅ UPDATE if exists
- ✅ INSERT if not exists
- ✅ Flexible updates

---

## 🧪 Testing

### **Test Create:**

```javascript
// Test 1: Tour only
const tour1 = await Tour.create({
  name: "Tour A",
  duration_days: 3
});
// → services + service_details_tour

// Test 2: Tour + Hotel
const tour2 = await Tour.create({
  name: "Tour B",
  duration_days: 4,
  hotel_name: "Hotel X"
});
// → services + service_details_tour + service_details_hotel

// Test 3: Full combo
const tour3 = await Tour.create({
  name: "Tour C",
  duration_days: 5,
  hotel_name: "Hotel Y",
  airline: "VN Airlines"
});
// → services + all 3 detail tables
```

### **Test Update:**

```javascript
// Update tour info
await Tour.update(15, {
  duration_days: 5,
  country: "Thailand"
});
// → UPDATE service_details_tour

// Add hotel info (first time)
await Tour.update(15, {
  hotel_name: "New Hotel",
  star_rating: 5
});
// → INSERT INTO service_details_hotel

// Update hotel info (second time)
await Tour.update(15, {
  star_rating: 4
});
// → UPDATE service_details_hotel
```

---

## 📝 Console Logs

### **Create:**
```
✅ Created service with ID: 15
✅ Created tour details
✅ Created hotel details
✅ Created flight details
✅ Transaction committed successfully
```

### **Update:**
```
✅ Updated service
✅ Updated tour details
✅ Inserted hotel details
✅ Updated flight details
✅ Update transaction committed
```

---

## ✅ Summary

**Đã fix:**
- ✅ Multi-table INSERT (create)
- ✅ Multi-table UPDATE/INSERT (update)
- ✅ Transaction support
- ✅ Conditional logic
- ✅ Auto-generated IDs
- ✅ Error handling (rollback)

**Result:**
- ✅ Tất cả data được lưu đúng tables
- ✅ IDs tự động tạo
- ✅ Data consistency
- ✅ Flexible updates

---

**Bây giờ hệ thống đã hoàn chỉnh!** 🎉

**Test ngay:**
1. Create service với full data
2. Verify data trong database
3. Update service
4. Verify updates

---

**Ngày fix:** 15/10/2025  
**File:** `backend/models/Tour.js`  
**Status:** ✅ Multi-table support implemented
