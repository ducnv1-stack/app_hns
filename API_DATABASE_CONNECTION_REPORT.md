# ✅ BÁO CÁO KẾT NỐI API VỚI DATABASE

## 📊 Tổng quan

Đã kiểm tra kết nối giữa API và Database cho các loại sản phẩm: **Tour, Hotel, Flight, Combo**.

---

## 🗄️ Cấu trúc Database

### **1. Bảng chính: `services`**
Lưu trữ tất cả các sản phẩm (Tour/Hotel/Flight/Combo)

```sql
CREATE TABLE services (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  short_description TEXT,
  description TEXT,
  service_type service_type_enum NOT NULL, -- TOUR/FLIGHT/HOTEL_ROOM/COMBO
  status service_status_enum DEFAULT 'ACTIVE',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Dữ liệu hiện tại:**
- ✅ **11 services** trong database
- ✅ **11 TOUR** (active)
- ⚠️ **0 FLIGHT** 
- ⚠️ **0 HOTEL_ROOM**
- ⚠️ **0 COMBO**

---

### **2. Bảng `service_variants`**
Lưu các biến thể của service (loại phòng, hạng ghế, loại vé)

```sql
CREATE TABLE service_variants (
  id BIGSERIAL PRIMARY KEY,
  service_id BIGINT REFERENCES services(id),
  name VARCHAR(255),
  description TEXT,
  price NUMERIC(10,2),
  currency VARCHAR(3) DEFAULT 'VND',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Dữ liệu hiện tại:**
- ✅ Có variants cho tours
- Ví dụ: "Người lớn" (2,500,000 VND), "Trẻ em 6-12 tuổi" (1,800,000 VND)

---

### **3. Bảng `service_availabilities`**
Lưu lịch trình và số lượng còn trống

```sql
CREATE TABLE service_availabilities (
  id BIGSERIAL PRIMARY KEY,
  service_id BIGINT REFERENCES services(id),
  variant_id BIGINT REFERENCES service_variants(id),
  start_datetime TIMESTAMP NOT NULL,
  end_datetime TIMESTAMP,
  total_capacity INTEGER,
  booked_capacity INTEGER,
  price NUMERIC(10,2),
  currency VARCHAR(3),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Dữ liệu hiện tại:**
- ✅ Có availabilities cho tours
- Ví dụ: Ngày 9/11/2025, Available: 25/25 slots

---

### **4. Bảng chi tiết theo loại service**

#### **Tour: `service_details_tour`**
```sql
- duration_days: Số ngày
- country: Quốc gia
- min_participants: Số người tối thiểu
- max_participants: Số người tối đa
- itinerary: Lịch trình (JSONB)
```

#### **Hotel: `service_details_hotel`** (Cần kiểm tra)
```sql
- star_rating: Hạng sao
- address: Địa chỉ
- amenities: Tiện nghi (JSONB)
- check_in_time: Giờ nhận phòng
- check_out_time: Giờ trả phòng
```

#### **Flight: `service_details_flight`** (Cần kiểm tra)
```sql
- airline: Hãng hàng không
- flight_number: Số hiệu chuyến bay
- departure_airport: Sân bay đi
- arrival_airport: Sân bay đến
- aircraft_type: Loại máy bay
```

#### **Combo: `service_details_combo`** (Cần kiểm tra)
```sql
- included_services: Các dịch vụ bao gồm (JSONB)
- special_offers: Ưu đãi đặc biệt
```

---

## 🔌 API Endpoints

### **1. GET /api/tours**
**Mục đích:** Lấy danh sách tất cả tours với filters

**Query Parameters:**
- `country`: Lọc theo quốc gia
- `category`: Lọc theo loại (TOUR/FLIGHT/HOTEL_ROOM/COMBO)
- `minPrice`: Giá tối thiểu
- `maxPrice`: Giá tối đa
- `search`: Tìm kiếm theo tên/mô tả
- `page`: Trang hiện tại (default: 1)
- `limit`: Số items mỗi trang (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "tours": [
      {
        "id": 1,
        "name": "Buôn Mê Thuột - Pleiku 4N3Đ",
        "service_type": "TOUR",
        "description": "...",
        "min_price": "800000.00",
        "max_price": "2500000.00",
        "images": [...],
        "duration_days": 4,
        "country": "Việt Nam"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 11,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Status:** ✅ **Hoạt động tốt**

---

### **2. GET /api/tours/:id**
**Mục đích:** Lấy chi tiết một tour

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Buôn Mê Thuột - Pleiku 4N3Đ",
    "service_type": "TOUR",
    "description": "Hành trình khám phá Tây Nguyên...",
    "status": "ACTIVE",
    "variants": [
      {
        "id": 1,
        "name": "Người lớn",
        "price": "2500000.00",
        "currency": "VND"
      },
      {
        "id": 2,
        "name": "Trẻ em (6-12 tuổi)",
        "price": "1800000.00",
        "currency": "VND"
      }
    ],
    "availabilities": [
      {
        "id": 1,
        "start_datetime": "2025-11-09T00:20:00.000Z",
        "end_datetime": "2025-11-12T02:40:00.000Z",
        "total_capacity": 25,
        "booked_capacity": 0,
        "available": 25,
        "status": "AVAILABLE"
      }
    ],
    "images": [...],
    "tour_details": {
      "duration_days": 4,
      "country": "Việt Nam",
      "min_participants": 1,
      "max_participants": 25,
      "itinerary": [...]
    }
  }
}
```

**Status:** ✅ **Hoạt động tốt**

---

## 📝 Mapping Form Data → Database

### **1. Thông tin Khách sạn (Hotel)**

| Form Field | Database Location |
|------------|-------------------|
| Tên khách sạn | `services.name` |
| Địa chỉ | `service_details_hotel.address` hoặc `services.description` |
| Hạng sao | `service_details_hotel.star_rating` hoặc `services.metadata->star_rating` |
| Loại phòng (Deluxe, Suite) | `service_variants.name` |
| Loại giường (King, Twin) | `service_variants.description` hoặc `metadata->bed_type` |
| Diện tích phòng | `service_variants.metadata->room_size` |
| Sức chứa tối đa | `service_variants.metadata->max_guests` |
| Giờ nhận phòng | `service_details_hotel.check_in_time` |
| Giờ trả phòng | `service_details_hotel.check_out_time` |
| Tiện nghi (Wifi, Pool, Gym) | `service_details_hotel.amenities` (JSONB array) |
| Chính sách hủy | `service_variants.metadata->cancellation_policy` |

**API Endpoint:** `/api/hotels` (Cần tạo)

---

### **2. Thông tin Vé máy bay (Flight)**

| Form Field | Database Location |
|------------|-------------------|
| Hãng hàng không | `service_details_flight.airline` |
| Số hiệu chuyến bay | `service_details_flight.flight_number` |
| Sân bay đi | `service_details_flight.departure_airport` |
| Sân bay đến | `service_details_flight.arrival_airport` |
| Giờ khởi hành | `service_availabilities.start_datetime` |
| Giờ đến | `service_availabilities.end_datetime` |
| Loại máy bay | `service_details_flight.aircraft_type` |
| Hành lý | `service_details_flight.baggage_allowance` |
| Hạng ghế (Economy, Business) | `service_variants.name` |
| Giá vé | `service_variants.price` |

**API Endpoint:** `/api/flights` (Cần tạo)

---

### **3. Thông tin Combo**

| Form Field | Database Location |
|------------|-------------------|
| Tên combo | `services.name` |
| Mô tả combo | `services.description` |
| Combo bao gồm (Tour/Hotel/Flight) | `services.metadata->includes` (array) |
| Ưu đãi đặc biệt | `services.metadata->special_offers` |
| Giá combo | `service_variants.price` |

**API Endpoint:** `/api/combos` (Cần tạo)

---

### **4. Thông tin Tour**

| Form Field | Database Location |
|------------|-------------------|
| Số ngày | `service_details_tour.duration_days` |
| Quốc gia | `service_details_tour.country` |
| Số người tối thiểu | `service_details_tour.min_participants` |
| Số người tối đa | `service_details_tour.max_participants` |
| Lịch trình | `service_details_tour.itinerary` (JSONB) |
| Giá người lớn | `service_variants.price` (variant: "Người lớn") |
| Giá trẻ em | `service_variants.price` (variant: "Trẻ em") |

**API Endpoint:** `/api/tours` ✅ **Đã có**

---

## ✅ Kết quả kiểm tra

### **Database Connection:**
- ✅ Bảng `services`: Kết nối thành công
- ✅ Bảng `service_variants`: Kết nối thành công
- ✅ Bảng `service_availabilities`: Kết nối thành công
- ✅ Bảng `service_details_tour`: Kết nối thành công
- ⚠️ Bảng `service_details_hotel`: Cần kiểm tra
- ⚠️ Bảng `service_details_flight`: Cần kiểm tra
- ⚠️ Bảng `service_details_combo`: Cần kiểm tra

### **API Endpoints:**
- ✅ `GET /api/tours`: Hoạt động tốt
- ✅ `GET /api/tours/:id`: Hoạt động tốt
- ✅ Filters (category, search, price): Hoạt động
- ✅ Pagination: Hoạt động
- ⚠️ `GET /api/hotels`: Chưa có
- ⚠️ `GET /api/flights`: Chưa có
- ⚠️ `GET /api/combos`: Chưa có

### **Data:**
- ✅ 11 Tours trong database
- ✅ Có variants (giá người lớn, trẻ em)
- ✅ Có availabilities (lịch khởi hành)
- ✅ Có images
- ⚠️ Chưa có data cho Hotel/Flight/Combo

---

## 🎯 Kết luận

### **✅ Đã hoàn thành:**
1. API Tours đã kết nối với database
2. Có thể lấy danh sách tours
3. Có thể lấy chi tiết tour
4. Có thể filter và search
5. Có pagination
6. Có variants (giá theo loại khách)
7. Có availabilities (lịch khởi hành)

### **⚠️ Cần bổ sung:**
1. **API cho Hotel** (`/api/hotels`, `/api/hotels/:id`)
2. **API cho Flight** (`/api/flights`, `/api/flights/:id`)
3. **API cho Combo** (`/api/combos`, `/api/combos/:id`)
4. **Sample data** cho Hotel/Flight/Combo
5. **Admin API** để tạo/sửa/xóa services

### **📋 Cấu trúc đề xuất cho API mới:**

```javascript
// Hotel API
GET /api/hotels              // List all hotels
GET /api/hotels/:id          // Get hotel detail
POST /api/admin/hotels       // Create hotel (admin)
PUT /api/admin/hotels/:id    // Update hotel (admin)
DELETE /api/admin/hotels/:id // Delete hotel (admin)

// Flight API
GET /api/flights             // List all flights
GET /api/flights/:id         // Get flight detail
POST /api/admin/flights      // Create flight (admin)
PUT /api/admin/flights/:id   // Update flight (admin)
DELETE /api/admin/flights/:id // Delete flight (admin)

// Combo API
GET /api/combos              // List all combos
GET /api/combos/:id          // Get combo detail
POST /api/admin/combos       // Create combo (admin)
PUT /api/admin/combos/:id    // Update combo (admin)
DELETE /api/admin/combos/:id // Delete combo (admin)
```

---

## 🚀 Hướng dẫn sử dụng

### **Test API hiện tại:**
```bash
# Test Tours API
node backend/scripts/testServicesAPI.js
node backend/scripts/testRealAPI.js

# Hoặc dùng curl
curl http://localhost:5000/api/tours
curl http://localhost:5000/api/tours/1
curl http://localhost:5000/api/tours?category=TOUR&search=Pleiku
```

### **Kiểm tra database:**
```bash
node backend/scripts/checkTableStructure.js
```

---

**Ngày tạo:** 13/10/2025  
**Status:** ✅ API Tours đã kết nối với database thành công!
