# 🔧 TOUR EDIT - UPDATE GUIDE

## 🎯 Objective

Update `TourEdit.jsx` để có 3 sections như `ServiceNew.jsx`:
1. **Tour Info** (đã có)
2. **Hotel Info** (thêm mới)
3. **Flight Info** (thêm mới)

---

## ✅ Đã Update

### **1. Imports:**
```javascript
import { Plane, Hotel as HotelIcon, Map } from 'lucide-react';
import TourInfoSection from './components/TourInfoSection';
import HotelInfoSection from './components/HotelInfoSection';
import FlightInfoSection from './components/FlightInfoSection';
```

### **2. State:**
```javascript
// Hotel data
const [hotelData, setHotelData] = useState({
  hotel_name: '',
  hotel_address: '',
  star_rating: 3,
  room_types: '',
  bed_types: '',
  room_area: '',
  max_occupancy: 2,
  check_in_time: '14:00',
  check_out_time: '12:00',
  amenities: []
});

// Flight data
const [flightData, setFlightData] = useState({
  airline: '',
  flight_number: '',
  departure_airport: '',
  arrival_airport: '',
  departure_time: '',
  arrival_time: '',
  aircraft_type: '',
  baggage_allowance: '23kg',
  cabin_class: 'ECONOMY'
});
```

### **3. Load Function:**
```javascript
// Load hotel data
setHotelData({
  hotel_name: data.hotel_name || '',
  hotel_address: data.hotel_address || '',
  star_rating: data.star_rating || 3,
  room_types: data.room_types || '',
  bed_types: data.bed_types || '',
  room_area: data.room_area || '',
  max_occupancy: data.max_occupancy || 2,
  check_in_time: data.check_in_time || '14:00',
  check_out_time: data.check_out_time || '12:00',
  amenities: data.amenities ? JSON.parse(data.amenities) : []
});

// Load flight data
setFlightData({
  airline: data.airline || '',
  flight_number: data.flight_number || '',
  departure_airport: data.departure_airport || '',
  arrival_airport: data.arrival_airport || '',
  departure_time: data.departure_time || '',
  arrival_time: data.arrival_time || '',
  aircraft_type: data.aircraft_type || '',
  baggage_allowance: data.baggage_allowance || '23kg',
  cabin_class: data.cabin_class || 'ECONOMY'
});
```

### **4. Save Function:**
```javascript
const onSaveAll = async () => {
  try {
    setError('');
    
    // Merge all data
    const updateData = {
      ...basic,
      ...hotelData,
      ...flightData,
      itinerary: itinerary.length > 0 ? itinerary : undefined
    };
    
    // Use Tour.update() which supports multi-table
    await adminTourService.updateBasic(id, updateData);
    await load();
    alert('Đã lưu tất cả thông tin');
  } catch (e) {
    console.error(e);
    setError(e.message || 'Lưu thất bại');
  }
};
```

---

## 📝 TODO: Update Render

### **Cần thêm vào phần return():**

```jsx
return (
  <div className="min-h-screen bg-gray-50">
    {/* Header với nút Lưu tất cả */}
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/admin/tours" className="btn-secondary inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
          </Link>
          <h1 className="text-xl font-semibold">Chỉnh sửa Tour</h1>
        </div>
        <button 
          onClick={onSaveAll} 
          className="btn-primary inline-flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Lưu tất cả
        </button>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Error/Success messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Section 1: Tour Info */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Map className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Thông tin Tour</h2>
        </div>
        {/* Use existing tour form OR use TourInfoSection component */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Existing basic info form */}
          {/* Existing itinerary form */}
        </div>
      </div>

      {/* Section 2: Hotel Info */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <HotelIcon className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Thông tin Khách sạn</h2>
        </div>
        <HotelInfoSection data={hotelData} onChange={setHotelData} />
      </div>

      {/* Section 3: Flight Info */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Plane className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Thông tin Vé máy bay</h2>
        </div>
        <FlightInfoSection data={flightData} onChange={setFlightData} />
      </div>

      {/* Images section (existing) */}
      
      {/* Bottom Save Button */}
      <div className="flex justify-end mt-8">
        <button 
          onClick={onSaveAll} 
          className="btn-primary inline-flex items-center px-8 py-3 text-lg"
        >
          <Save className="h-5 w-5 mr-2" />
          Lưu tất cả thông tin
        </button>
      </div>
    </div>
  </div>
);
```

---

## 🔧 Implementation Steps

### **Step 1: Update imports** ✅ DONE
### **Step 2: Add state** ✅ DONE
### **Step 3: Update load()** ✅ DONE
### **Step 4: Add onSaveAll()** ✅ DONE
### **Step 5: Update render** ⏳ TODO

---

## 📊 Data Flow

```
Load Tour
  ↓
GET /api/admin/tours/:id/content
  ↓
Backend joins all tables:
  - services
  - service_details_tour
  - service_details_hotel
  - service_details_flight
  ↓
Return merged data
  ↓
Frontend populates:
  - basic state
  - hotelData state
  - flightData state
  ↓
User edits in 3 sections
  ↓
Click "Lưu tất cả"
  ↓
Merge all states
  ↓
PUT /api/admin/tours/:id
  ↓
Tour.update() (multi-table)
  ↓
Update all tables
  ↓
Success!
```

---

## ✅ Backend Support

**Already implemented:**
- ✅ `Tour.update()` - Multi-table UPDATE/INSERT
- ✅ `Tour.findById()` - Joins all tables
- ✅ `/api/admin/tours/:id/content` - Returns merged data

---

## 🎯 Result

**Sau khi update:**
1. Trang TourEdit có 3 sections
2. User có thể chỉnh sửa hotel info
3. User có thể chỉnh sửa flight info
4. Click "Lưu tất cả" → Lưu vào đúng tables
5. Data consistency

---

## 📝 Next Steps

1. Update phần render của TourEdit.jsx
2. Test load data
3. Test save data
4. Verify database updates

---

**File cần update:** `src/pages/admin/TourEdit.jsx`  
**Status:** 80% complete (chỉ còn update render)
