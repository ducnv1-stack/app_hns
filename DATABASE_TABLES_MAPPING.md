# 📊 DATABASE TABLES MAPPING - CHI TIẾT

## Khi chỉnh sửa tour, dữ liệu được lưu vào 4 BẢNG:

---

## 1️⃣ BẢNG `services` (Thông tin chính)

**Mục đích:** Lưu thông tin cơ bản của tour

| Field | Giá trị từ Frontend | Mô tả |
|-------|---------------------|-------|
| `id` | Auto-generated | ID tự động (PRIMARY KEY) |
| `name` | tourData.name | Tên tour |
| `short_description` | tourData.short_description | Mô tả ngắn |
| `description` | tourData.description | Mô tả chi tiết |
| `service_type` | tourData.service_type | Loại hình (TOUR/HOTEL/FLIGHT/COMBO) |
| `status` | tourData.status | Trạng thái (ACTIVE/INACTIVE/DRAFT) |
| `created_at` | Auto | Ngày tạo |
| `updated_at` | Auto | Ngày cập nhật |

**Ví dụ:**
```sql
UPDATE services 
SET 
  name = 'Đà Lạt - Nha Trang 4N3Đ',
  short_description = 'Tour khám phá Đà Lạt và Nha Trang',
  description = 'Mô tả chi tiết về tour...',
  service_type = 'TOUR',
  status = 'ACTIVE',
  updated_at = NOW()
WHERE id = 8;
```

---

## 2️⃣ BẢNG `service_details_tour` (Chi tiết Tour)

**Mục đích:** Lưu thông tin chi tiết về tour du lịch

| Field | Giá trị từ Frontend | Mô tả |
|-------|---------------------|-------|
| `id` | Auto-generated | ID tự động (PRIMARY KEY) |
| `service_id` | 8 (tour ID) | Foreign key → services.id |
| `duration_days` | tourData.duration_days | Số ngày (VD: 4) |
| `country` | tourData.country | Quốc gia (VD: "Việt Nam") |
| `min_participants` | tourData.min_participants | Số người tối thiểu (VD: 10) |
| `max_participants` | tourData.max_participants | Số người tối đa (VD: 25) |
| `departure_date` | tourData.departure_date | Ngày đi (VD: "2025-11-01") |
| `return_date` | tourData.return_date | Ngày về (VD: "2025-11-04") |
| `itinerary` | tourData.itinerary | Lịch trình (JSONB) |
| `created_at` | Auto | Ngày tạo |
| `updated_at` | Auto | Ngày cập nhật |

**Ví dụ itinerary (JSONB):**
```json
[
  {
    "day": 1,
    "title": "Khởi hành - Tham quan Đà Lạt",
    "description": "Sáng: Khởi hành từ TP.HCM..."
  },
  {
    "day": 2,
    "title": "Tham quan thác Datanla",
    "description": "Cả ngày tham quan..."
  }
]
```

**SQL:**
```sql
UPDATE service_details_tour 
SET 
  duration_days = 4,
  country = 'Việt Nam',
  min_participants = 10,
  max_participants = 25,
  departure_date = '2025-11-01',
  return_date = '2025-11-04',
  itinerary = '[{"day":1,"title":"Khởi hành","description":"..."}]'::jsonb,
  updated_at = NOW()
WHERE service_id = 8;
```

---

## 3️⃣ BẢNG `service_details_hotel` (Chi tiết Khách sạn)

**Mục đích:** Lưu thông tin về khách sạn (nếu tour bao gồm khách sạn)

| Field | Giá trị từ Frontend | Mô tả |
|-------|---------------------|-------|
| `id` | Auto-generated | ID tự động (PRIMARY KEY) |
| `service_id` | 8 (tour ID) | Foreign key → services.id |
| `hotel_name` | hotelData.hotel_name | Tên khách sạn (VD: "Khách sạn ABC") |
| `hotel_address` | hotelData.hotel_address | Địa chỉ khách sạn |
| `star_rating` | hotelData.star_rating | Hạng sao (1-5) |
| `room_type` | hotelData.room_types | Loại phòng (VD: "Deluxe, Suite") |
| `bed_type` | hotelData.bed_types | Loại giường (VD: "King, Twin") |
| `room_size` | hotelData.room_area | Diện tích phòng (m²) |
| `max_occupancy` | hotelData.max_occupancy | Sức chứa tối đa (VD: 2) |
| `amenities` | hotelData.amenities | Tiện nghi (JSONB) |
| `check_in_time` | hotelData.check_in_time | Giờ nhận phòng (VD: "14:00") |
| `check_out_time` | hotelData.check_out_time | Giờ trả phòng (VD: "12:00") |
| `created_at` | Auto | Ngày tạo |
| `updated_at` | Auto | Ngày cập nhật |

**Ví dụ amenities (JSONB):**
```json
["wifi", "pool", "gym", "breakfast", "parking", "spa", "restaurant", "bar", "room_service", "laundry"]
```

**SQL:**
```sql
-- Nếu chưa có record, INSERT
INSERT INTO service_details_hotel (
  service_id, hotel_name, hotel_address, star_rating, 
  room_type, bed_type, room_size, max_occupancy, 
  amenities, check_in_time, check_out_time
) VALUES (
  8, 
  'Khách sạn ABC', 
  '123 Đường XYZ, Đà Lạt', 
  4, 
  'Deluxe, Suite', 
  'King, Twin', 
  35.5, 
  2, 
  '["wifi","pool","gym","breakfast"]'::jsonb, 
  '14:00', 
  '12:00'
)
ON CONFLICT (service_id) DO UPDATE SET
  hotel_name = EXCLUDED.hotel_name,
  hotel_address = EXCLUDED.hotel_address,
  star_rating = EXCLUDED.star_rating,
  room_type = EXCLUDED.room_type,
  bed_type = EXCLUDED.bed_type,
  room_size = EXCLUDED.room_size,
  max_occupancy = EXCLUDED.max_occupancy,
  amenities = EXCLUDED.amenities,
  check_in_time = EXCLUDED.check_in_time,
  check_out_time = EXCLUDED.check_out_time,
  updated_at = NOW();
```

---

## 4️⃣ BẢNG `service_details_flight` (Chi tiết Vé máy bay)

**Mục đích:** Lưu thông tin về vé máy bay (nếu tour bao gồm vé máy bay)

| Field | Giá trị từ Frontend | Mô tả |
|-------|---------------------|-------|
| `id` | Auto-generated | ID tự động (PRIMARY KEY) |
| `service_id` | 8 (tour ID) | Foreign key → services.id |
| `airline` | flightData.airline | Hãng hàng không (VD: "Vietnam Airlines") |
| `flight_number` | flightData.flight_number | Số hiệu chuyến bay (VD: "VN123") |
| `departure_airport` | flightData.departure_airport | Sân bay đi (VD: "Nội Bài (HAN)") |
| `arrival_airport` | flightData.arrival_airport | Sân bay đến (VD: "Tân Sơn Nhất (SGN)") |
| `departure_time` | flightData.departure_time | Giờ khởi hành (VD: "08:00") |
| `arrival_time` | flightData.arrival_time | Giờ đến (VD: "10:00") |
| `aircraft_type` | flightData.aircraft_type | Loại máy bay (VD: "Boeing 787") |
| `baggage_allowance` | flightData.baggage_allowance | Hành lý (VD: "23kg") |
| `seat_class` | flightData.cabin_class | Hạng ghế (ECONOMY/BUSINESS/FIRST) |
| `created_at` | Auto | Ngày tạo |
| `updated_at` | Auto | Ngày cập nhật |

**SQL:**
```sql
-- Nếu chưa có record, INSERT
INSERT INTO service_details_flight (
  service_id, airline, flight_number, 
  departure_airport, arrival_airport, 
  departure_time, arrival_time, 
  aircraft_type, baggage_allowance, seat_class
) VALUES (
  8, 
  'Vietnam Airlines', 
  'VN123', 
  'Nội Bài (HAN)', 
  'Tân Sơn Nhất (SGN)', 
  '08:00', 
  '10:00', 
  'Boeing 787', 
  '23kg', 
  'ECONOMY'
)
ON CONFLICT (service_id) DO UPDATE SET
  airline = EXCLUDED.airline,
  flight_number = EXCLUDED.flight_number,
  departure_airport = EXCLUDED.departure_airport,
  arrival_airport = EXCLUDED.arrival_airport,
  departure_time = EXCLUDED.departure_time,
  arrival_time = EXCLUDED.arrival_time,
  aircraft_type = EXCLUDED.aircraft_type,
  baggage_allowance = EXCLUDED.baggage_allowance,
  seat_class = EXCLUDED.seat_class,
  updated_at = NOW();
```

---

## 📊 TỔNG HỢP

### **Khi bạn chỉnh sửa tour và click "Lưu tất cả":**

```
Frontend (TourEdit.jsx)
  ↓
Merge data:
  - tourData (Section 1)
  - hotelData (Section 2)
  - flightData (Section 3)
  ↓
PUT /api/admin/tours/8
  ↓
Backend: Tour.update(8, payload)
  ↓
BEGIN TRANSACTION
  ↓
1. UPDATE services
   - name, description, service_type, status
  ↓
2. UPDATE/INSERT service_details_tour
   - duration_days, country, min/max_participants
   - departure_date, return_date, itinerary
  ↓
3. UPDATE/INSERT service_details_hotel
   - hotel_name, star_rating, amenities
   - room_type, bed_type, check_in/out_time
  ↓
4. UPDATE/INSERT service_details_flight
   - airline, flight_number
   - departure/arrival airport & time
   - aircraft_type, baggage, seat_class
  ↓
COMMIT TRANSACTION
  ↓
✅ All data saved to 4 tables
```

---

## 🔍 VERIFY DATA

### **Query để kiểm tra data đã lưu:**

```sql
-- 1. Check main service info
SELECT id, name, service_type, status, updated_at
FROM services
WHERE id = 8;

-- 2. Check tour details
SELECT 
  service_id, 
  duration_days, 
  country, 
  min_participants, 
  max_participants,
  departure_date,
  return_date,
  itinerary
FROM service_details_tour
WHERE service_id = 8;

-- 3. Check hotel details
SELECT 
  service_id,
  hotel_name,
  hotel_address,
  star_rating,
  room_type,
  bed_type,
  room_size,
  max_occupancy,
  amenities,
  check_in_time,
  check_out_time
FROM service_details_hotel
WHERE service_id = 8;

-- 4. Check flight details
SELECT 
  service_id,
  airline,
  flight_number,
  departure_airport,
  arrival_airport,
  departure_time,
  arrival_time,
  aircraft_type,
  baggage_allowance,
  seat_class
FROM service_details_flight
WHERE service_id = 8;
```

---

## 📝 NOTES

### **Quan trọng:**

1. **services** - LUÔN được update (bảng chính)
2. **service_details_tour** - LUÔN được update (vì là tour)
3. **service_details_hotel** - Chỉ INSERT/UPDATE nếu có data
4. **service_details_flight** - Chỉ INSERT/UPDATE nếu có data

### **UNIQUE Constraint:**

Mỗi bảng detail có `UNIQUE(service_id)`:
- Mỗi tour chỉ có 1 record trong mỗi bảng detail
- Nếu đã tồn tại → UPDATE
- Nếu chưa tồn tại → INSERT

### **JSONB Fields:**

- `itinerary` trong `service_details_tour`
- `amenities` trong `service_details_hotel`

→ Lưu dạng JSON, có thể query với PostgreSQL JSON operators

---

## ✅ SUMMARY

**4 BẢNG được cập nhật:**

1. ✅ `services` - Thông tin chính (name, description, status)
2. ✅ `service_details_tour` - Chi tiết tour (duration, dates, itinerary)
3. ✅ `service_details_hotel` - Chi tiết khách sạn (hotel_name, amenities)
4. ✅ `service_details_flight` - Chi tiết vé máy bay (airline, flight_number)

**Transaction Safety:**
- BEGIN → UPDATE all tables → COMMIT
- Nếu lỗi → ROLLBACK (không lưu gì cả)
- All-or-nothing (đảm bảo data consistency)

---

**Ngày tạo:** 15/10/2025  
**Status:** ✅ Complete database mapping
