# 🔍 DATABASE FLOW ANALYSIS

## ✅ Current Status

### **Database Schema:**

```sql
services (main table)
├── id SERIAL PRIMARY KEY ← Auto-generated
├── name VARCHAR(255)
├── service_type VARCHAR(20)
├── status VARCHAR(20)
├── created_at TIMESTAMP
└── ...

service_details_tour
├── id SERIAL PRIMARY KEY ← Auto-generated
├── service_id → services.id
├── duration_days INT
├── country VARCHAR
├── itinerary JSONB
└── ...

service_details_hotel
├── id SERIAL PRIMARY KEY ← Auto-generated
├── service_id → services.id
├── hotel_name VARCHAR
├── star_rating INT
├── amenities JSONB
└── ...

service_details_flight
├── id SERIAL PRIMARY KEY ← Auto-generated
├── service_id → services.id
├── airline VARCHAR
├── flight_number VARCHAR
└── ...
```

---

## ❌ PROBLEM: Model không hỗ trợ multi-table insert

### **Current Tour.create():**

```javascript
// backend/models/Tour.js
static async create(tourData) {
  // ❌ CHỈ INSERT vào bảng services
  const query = `
    INSERT INTO services (name, description, ...)
    VALUES ($1, $2, ...)
    RETURNING *
  `;
  
  // ❌ KHÔNG INSERT vào:
  // - service_details_hotel
  // - service_details_flight
}
```

**Result:**
- ✅ services table: OK (có ID tự động)
- ❌ service_details_hotel: EMPTY
- ❌ service_details_flight: EMPTY

---

## ✅ SOLUTION: Update Model để hỗ trợ multi-table

### **New Tour.create() - Fixed:**

```javascript
static async create(tourData) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 1. INSERT vào services (main table)
    const serviceResult = await client.query(`
      INSERT INTO services (name, service_type, status, ...)
      VALUES ($1, $2, $3, ...)
      RETURNING *
    `, [name, service_type, status, ...]);
    
    const serviceId = serviceResult.rows[0].id; // ← Auto-generated ID
    
    // 2. INSERT vào service_details_tour (nếu có tour data)
    if (tourData.duration_days || tourData.itinerary) {
      await client.query(`
        INSERT INTO service_details_tour (
          service_id, duration_days, country, itinerary, ...
        ) VALUES ($1, $2, $3, $4, ...)
      `, [serviceId, duration_days, country, itinerary, ...]);
    }
    
    // 3. INSERT vào service_details_hotel (nếu có hotel data)
    if (tourData.hotel_name) {
      await client.query(`
        INSERT INTO service_details_hotel (
          service_id, hotel_name, star_rating, amenities, ...
        ) VALUES ($1, $2, $3, $4, ...)
      `, [serviceId, hotel_name, star_rating, amenities, ...]);
    }
    
    // 4. INSERT vào service_details_flight (nếu có flight data)
    if (tourData.airline) {
      await client.query(`
        INSERT INTO service_details_flight (
          service_id, airline, flight_number, ...
        ) VALUES ($1, $2, $3, ...)
      `, [serviceId, airline, flight_number, ...]);
    }
    
    await client.query('COMMIT');
    
    return { id: serviceId, ...serviceResult.rows[0] };
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

---

## 📊 Data Flow

### **Frontend → Backend → Database:**

```
ServiceNew.jsx (Frontend)
  ↓
  tourData: { name, duration_days, ... }
  hotelData: { hotel_name, star_rating, ... }
  flightData: { airline, flight_number, ... }
  ↓
Merge into single payload
  ↓
POST /api/admin/tours
  ↓
Tour.create(payload) (Backend Model)
  ↓
BEGIN TRANSACTION
  ↓
INSERT INTO services → Get ID (auto-generated)
  ↓
INSERT INTO service_details_tour (if has tour data)
  ↓
INSERT INTO service_details_hotel (if has hotel data)
  ↓
INSERT INTO service_details_flight (if has flight data)
  ↓
COMMIT TRANSACTION
  ↓
Return service ID + data
```

---

## 🔧 Fix Required

### **File:** `backend/models/Tour.js`

**Need to update:**
1. ✅ `Tour.create()` - Multi-table insert
2. ✅ `Tour.update()` - Multi-table update
3. ✅ `Tour.findById()` - Join all detail tables

---

## ✅ Auto-Generated IDs

### **All tables have SERIAL PRIMARY KEY:**

```sql
-- services table
id SERIAL PRIMARY KEY  ← Auto: 1, 2, 3, ...

-- service_details_tour
id SERIAL PRIMARY KEY  ← Auto: 1, 2, 3, ...
service_id → services.id (foreign key)

-- service_details_hotel
id SERIAL PRIMARY KEY  ← Auto: 1, 2, 3, ...
service_id → services.id (foreign key)

-- service_details_flight
id SERIAL PRIMARY KEY  ← Auto: 1, 2, 3, ...
service_id → services.id (foreign key)
```

**How it works:**
1. INSERT INTO services → PostgreSQL auto-generates ID (e.g., 15)
2. Use that ID for detail tables: service_id = 15
3. Each detail table also has its own auto-generated ID

---

## 📝 Example

### **Input (from frontend):**
```javascript
{
  // Tour data
  name: "Đà Lạt - Nha Trang 4N3Đ",
  duration_days: 4,
  country: "Việt Nam",
  
  // Hotel data
  hotel_name: "Khách sạn ABC",
  star_rating: 4,
  amenities: ["wifi", "pool"],
  
  // Flight data
  airline: "Vietnam Airlines",
  flight_number: "VN123"
}
```

### **Database result:**

**services table:**
```
id | name                      | service_type | status
15 | Đà Lạt - Nha Trang 4N3Đ  | TOUR         | DRAFT
```

**service_details_tour:**
```
id | service_id | duration_days | country
1  | 15         | 4             | Việt Nam
```

**service_details_hotel:**
```
id | service_id | hotel_name      | star_rating | amenities
1  | 15         | Khách sạn ABC   | 4           | ["wifi","pool"]
```

**service_details_flight:**
```
id | service_id | airline           | flight_number
1  | 15         | Vietnam Airlines  | VN123
```

---

## ⚠️ Current Issue

**Model Tour.create() chỉ INSERT vào `services` table:**
- ✅ services.id = auto-generated
- ❌ service_details_hotel = EMPTY
- ❌ service_details_flight = EMPTY

**Cần fix:**
- Update Tour.create() để INSERT vào tất cả tables
- Update Tour.update() để UPDATE tất cả tables
- Update Tour.findById() để JOIN tất cả tables

---

## 🚀 Next Steps

1. **Update Tour.create()** - Multi-table insert
2. **Update Tour.update()** - Multi-table update  
3. **Update Tour.findById()** - Join all tables
4. **Test** - Verify data saved correctly

---

**Bạn muốn tôi fix Model ngay không?** 🔧
