# 🔧 TOUR EDIT - REFACTOR INSTRUCTIONS

## ❌ Vấn đề hiện tại

File `TourEdit.jsx` bị duplicate code và layout không đúng.

---

## ✅ Giải pháp

**Xóa toàn bộ phần return() cũ và thay bằng code mới:**

### **Code mới (từ dòng 287 đến cuối):**

```jsx
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/admin/tours" className="btn-secondary inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
            </Link>
            <h1 className="text-xl font-semibold">Chỉnh sửa Tour</h1>
            <span className="text-sm text-gray-500">ID: {id}</span>
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
        {/* Error messages */}
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
          <TourInfoSection 
            data={{
              ...basic,
              itinerary: itinerary,
              departure_date: basic.departure_date || '',
              return_date: basic.return_date || ''
            }} 
            onChange={(newData) => {
              const { itinerary: newItinerary, ...restData } = newData;
              setBasic(restData);
              if (newItinerary) setItinerary(newItinerary);
            }} 
          />
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

        {/* Bottom Save Button */}
        <div className="flex justify-end">
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
}
```

---

## 📝 Steps

1. **Backup file hiện tại** (optional)
2. **Xóa từ dòng 287 đến cuối file**
3. **Copy code mới vào**
4. **Save file**
5. **Test**

---

## ✅ Result

**Layout mới:**
```
┌──────────────────────────────────┐
│  [← Quay lại] Chỉnh sửa Tour    │
│  ID: 12            [Lưu tất cả]  │
└──────────────────────────────────┘

📋 Thông tin Tour
[TourInfoSection component]

🏨 Thông tin Khách sạn
[HotelInfoSection component]

✈️ Thông tin Vé máy bay
[FlightInfoSection component]

        [Lưu tất cả thông tin]
```

---

**Bạn muốn tôi tạo file mới hoàn chỉnh không?**
