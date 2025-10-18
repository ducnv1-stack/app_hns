# ✅ UNIFIED SERVICE FORM - HOÀN THÀNH

## 🎯 Concept: 3 Sections trong 1 Trang

**Single scrollable page** với 3 sections:
1. **📋 Thông tin Tour** - Tour info
2. **🏨 Thông tin Khách sạn** - Hotel info
3. **✈️ Thông tin Vé máy bay** - Flight info

---

## 📁 Files Created

### **Main Component:**
- ✅ `src/pages/admin/ServiceNew.jsx`

### **Sub-components:**
- ✅ `src/pages/admin/components/TourInfoSection.jsx`
- ✅ `src/pages/admin/components/HotelInfoSection.jsx`
- ✅ `src/pages/admin/components/FlightInfoSection.jsx`

### **Modified:**
- ✅ `src/App.jsx` - Updated route to use ServiceNew

---

## 🎨 Layout

```
┌─────────────────────────────────────────┐
│  [← Quay lại]  Thêm Dịch Vụ Mới [Lưu]  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  📋 THÔNG TIN TOUR                      │
│  - Tên tour *                           │
│  - Loại hình / Trạng thái              │
│  - Số ngày / Quốc gia                  │
│  - Số người (min/max)                   │
│  - Mô tả                                │
│  - Ngày đi / Ngày về                    │
│  - Lịch trình chi tiết                  │
└─────────────────────────────────────────┘
              ↓ Scroll
┌─────────────────────────────────────────┐
│  🏨 THÔNG TIN KHÁCH SẠN                 │
│  - Tên khách sạn                        │
│  - Địa chỉ                              │
│  - Hạng sao / Loại phòng                │
│  - Loại giường / Diện tích              │
│  - Sức chứa / Giờ nhận/trả phòng        │
│  - Tiện nghi (checkboxes)               │
└─────────────────────────────────────────┘
              ↓ Scroll
┌─────────────────────────────────────────┐
│  ✈️ THÔNG TIN VÉ MÁY BAY                │
│  - Hãng hàng không / Số hiệu            │
│  - Sân bay đi / Sân bay đến             │
│  - Giờ khởi hành / Giờ đến              │
│  - Loại máy bay / Hành lý               │
│  - Hạng ghế                             │
└─────────────────────────────────────────┘

        [💾 Lưu tất cả thông tin]
```

---

## 🔧 Features

### **1. Smart Data Merging**
```javascript
const payload = {
  // Tour data (always)
  name, description, duration_days, ...
  
  // Hotel data (only if filled)
  hotel_name: hotelData.hotel_name || undefined,
  star_rating: hotelData.star_rating || undefined,
  
  // Flight data (only if filled)
  airline: flightData.airline || undefined,
  flight_number: flightData.flight_number || undefined,
};

// Remove undefined values
const cleanPayload = Object.fromEntries(
  Object.entries(payload).filter(([_, v]) => v !== undefined)
);
```

### **2. Conditional Upload**
- ✅ Chỉ upload fields có giá trị
- ✅ Không upload fields rỗng
- ✅ Backend nhận data sạch

### **3. Validation**
- ✅ Required: Tên tour
- ✅ Optional: Tất cả fields khác
- ✅ Smart validation theo section

---

## 📊 Data Structure

### **Tour Data:**
```javascript
{
  name: 'Đà Lạt - Nha Trang 4N3Đ',
  service_type: 'TOUR',
  status: 'DRAFT',
  duration_days: 4,
  country: 'Việt Nam',
  min_participants: 10,
  max_participants: 25,
  departure_date: '2025-11-01',
  return_date: '2025-11-04',
  itinerary: [
    { day: 1, title: 'Khởi hành', description: '...' }
  ]
}
```

### **Hotel Data:**
```javascript
{
  hotel_name: 'Khách sạn ABC',
  hotel_address: '123 Đường XYZ',
  star_rating: 4,
  room_types: 'Deluxe, Suite',
  bed_types: 'King, Twin',
  room_area: '35',
  max_occupancy: 2,
  check_in_time: '14:00',
  check_out_time: '12:00',
  amenities: ['wifi', 'pool', 'gym']
}
```

### **Flight Data:**
```javascript
{
  airline: 'Vietnam Airlines',
  flight_number: 'VN123',
  departure_airport: 'HAN',
  arrival_airport: 'SGN',
  departure_time: '08:00',
  arrival_time: '10:00',
  aircraft_type: 'Boeing 787',
  baggage_allowance: '23kg',
  cabin_class: 'ECONOMY'
}
```

---

## 🎯 User Flow

```
1. Admin clicks "Thêm tour mới"
   ↓
2. Navigate to /admin/tours/new
   ↓
3. Fill Section 1: Tour Info
   - Tên tour *
   - Ngày đi/về
   - Lịch trình
   ↓
4. Scroll down to Section 2: Hotel Info
   - Tên khách sạn
   - Địa chỉ, hạng sao
   - Tiện nghi
   ↓
5. Scroll down to Section 3: Flight Info
   - Hãng hàng không
   - Sân bay, giờ bay
   ↓
6. Click "Lưu tất cả"
   ↓
7. System merges all 3 sections
   ↓
8. Remove empty fields
   ↓
9. POST to backend
   ↓
10. Redirect to edit page
```

---

## 🧪 Testing

### **Test Case 1: Tour Only**
```
Input:
- Tour: Full info
- Hotel: Empty
- Flight: Empty

Expected:
- Only tour data uploaded
- Hotel/Flight fields = null
```

### **Test Case 2: Tour + Hotel**
```
Input:
- Tour: Full info
- Hotel: Full info
- Flight: Empty

Expected:
- Tour + Hotel data uploaded
- Flight fields = null
```

### **Test Case 3: Full Combo**
```
Input:
- Tour: Full info
- Hotel: Full info
- Flight: Full info

Expected:
- All data uploaded
- Complete service created
```

---

## 📝 Field Mapping

### **Tour Section:**
| Field | Type | Required |
|-------|------|----------|
| name | text | ✅ |
| service_type | select | ✅ |
| status | select | ✅ |
| duration_days | number | ✅ |
| country | text | ✅ |
| min_participants | number | ✅ |
| max_participants | number | ✅ |
| departure_date | date | ❌ |
| return_date | date | ❌ |
| itinerary | array | ❌ |

### **Hotel Section:**
| Field | Type | Required |
|-------|------|----------|
| hotel_name | text | ❌ |
| hotel_address | textarea | ❌ |
| star_rating | select | ❌ |
| room_types | text | ❌ |
| bed_types | text | ❌ |
| room_area | number | ❌ |
| max_occupancy | number | ❌ |
| check_in_time | time | ❌ |
| check_out_time | time | ❌ |
| amenities | array | ❌ |

### **Flight Section:**
| Field | Type | Required |
|-------|------|----------|
| airline | text | ❌ |
| flight_number | text | ❌ |
| departure_airport | text | ❌ |
| arrival_airport | text | ❌ |
| departure_time | time | ❌ |
| arrival_time | time | ❌ |
| aircraft_type | text | ❌ |
| baggage_allowance | text | ❌ |
| cabin_class | select | ❌ |

---

## 🎨 UI/UX

### **Section Headers:**
- 📋 Icon + Title
- Clear visual separation
- Sticky header (optional)

### **Form Layout:**
- 2 columns on desktop
- 1 column on mobile
- Consistent spacing

### **Save Button:**
- Top right (sticky)
- Bottom center (fixed)
- Loading state

---

## ✅ Advantages

1. **Single Page** - Không cần switch tabs
2. **Natural Flow** - Scroll xuống để điền
3. **Smart Upload** - Chỉ upload data có giá trị
4. **Flexible** - Có thể điền 1, 2, hoặc cả 3 sections
5. **Clean Code** - Component-based architecture

---

## 🚀 Next Steps

### **Enhancements:**
1. Add image upload section
2. Add pricing section
3. Add preview panel
4. Add save draft functionality
5. Add template system

---

## 📚 Summary

**Created:**
- ✅ ServiceNew.jsx (main)
- ✅ TourInfoSection.jsx
- ✅ HotelInfoSection.jsx
- ✅ FlightInfoSection.jsx

**Features:**
- ✅ 3 sections in 1 page
- ✅ Smart data merging
- ✅ Conditional upload
- ✅ Clean validation

**Result:**
- ✅ Unified form for all services
- ✅ Flexible data entry
- ✅ Clean backend integration

---

**Test ngay:**
```
http://localhost:5173/#/admin/tours/new
```

1. Fill tour info
2. Scroll to hotel info
3. Scroll to flight info
4. Click "Lưu tất cả"
5. Verify data saved correctly

---

**Ngày hoàn thành:** 15/10/2025  
**Status:** ✅ Unified service form implemented
