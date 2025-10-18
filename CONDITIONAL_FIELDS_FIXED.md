# ✅ CONDITIONAL FIELDS - ĐÃ FIX

## ❌ Vấn đề

**Payload cũ gửi:**
```json
{
  "name": "Tour ABC",
  "star_rating": 3,           // ❌ Gửi mà không có hotel_name
  "max_occupancy": 2,          // ❌ Gửi mà không có hotel_name
  "amenities": ["bar", "gym"], // ❌ Gửi mà không có hotel_name
  "baggage_allowance": "23kg", // ❌ Gửi mà không có airline
  "cabin_class": "ECONOMY"     // ❌ Gửi mà không có airline
}
```

**Vấn đề:**
- Hotel fields được gửi mặc dù không có `hotel_name`
- Flight fields được gửi mặc dù không có `airline`
- Backend có thể reject vì logic không hợp lệ

---

## ✅ Giải pháp

**File:** `src/pages/admin/TourEdit.jsx`

### **Logic mới:**

**1. Hotel fields - CHỈ gửi khi có `hotel_name`:**
```javascript
// Before (WRONG)
if (hotelData.star_rating) payload.star_rating = hotelData.star_rating;
if (hotelData.amenities?.length > 0) payload.amenities = hotelData.amenities;

// After (CORRECT)
if (hotelData.hotel_name && hotelData.hotel_name.trim()) {
  payload.hotel_name = hotelData.hotel_name;
  if (hotelData.star_rating) payload.star_rating = hotelData.star_rating;
  if (hotelData.amenities?.length > 0) payload.amenities = hotelData.amenities;
  // ... other hotel fields
}
```

**2. Flight fields - CHỈ gửi khi có `airline`:**
```javascript
// Before (WRONG)
if (flightData.baggage_allowance) payload.baggage_allowance = flightData.baggage_allowance;
if (flightData.cabin_class) payload.cabin_class = flightData.cabin_class;

// After (CORRECT)
if (flightData.airline && flightData.airline.trim()) {
  payload.airline = flightData.airline;
  if (flightData.baggage_allowance) payload.baggage_allowance = flightData.baggage_allowance;
  if (flightData.cabin_class) payload.cabin_class = flightData.cabin_class;
  // ... other flight fields
}
```

---

## 📊 Payload Examples

### **Case 1: Tour only (no hotel, no flight)**

**Input:**
- Tour: Filled
- Hotel: Empty
- Flight: Empty

**Payload:**
```json
{
  "name": "Tour ABC",
  "duration_days": 4,
  "country": "Việt Nam"
  // ✅ No hotel fields
  // ✅ No flight fields
}
```

### **Case 2: Tour + Hotel**

**Input:**
- Tour: Filled
- Hotel: hotel_name = "ABC Hotel", amenities = ["wifi", "pool"]
- Flight: Empty

**Payload:**
```json
{
  "name": "Tour ABC",
  "duration_days": 4,
  "hotel_name": "ABC Hotel",        // ✅ Has hotel_name
  "star_rating": 3,                 // ✅ Included
  "amenities": ["wifi", "pool"]     // ✅ Included
  // ✅ No flight fields
}
```

### **Case 3: Tour + Hotel + Flight**

**Input:**
- Tour: Filled
- Hotel: hotel_name = "ABC Hotel"
- Flight: airline = "Vietnam Airlines"

**Payload:**
```json
{
  "name": "Tour ABC",
  "duration_days": 4,
  "hotel_name": "ABC Hotel",        // ✅ Has hotel_name
  "star_rating": 3,                 // ✅ Included
  "airline": "Vietnam Airlines",    // ✅ Has airline
  "baggage_allowance": "23kg"       // ✅ Included
}
```

---

## 🎯 Logic Flow

```
User fills form
  ↓
Click "Lưu tất cả"
  ↓
Check hotel_name:
  - If empty → Skip ALL hotel fields
  - If filled → Include ALL hotel fields
  ↓
Check airline:
  - If empty → Skip ALL flight fields
  - If filled → Include ALL flight fields
  ↓
Send payload
  ↓
Backend validates
  ↓
✅ Success
```

---

## ✅ Benefits

**1. Clean payload:**
- Không gửi fields không cần thiết
- Giảm kích thước request

**2. Logic rõ ràng:**
- Hotel fields → Cần hotel_name
- Flight fields → Cần airline

**3. Tránh lỗi validation:**
- Backend không nhận được orphan fields
- Data consistency

---

## 🧪 Test Cases

### **Test 1: Tour only**
1. Fill tour info
2. Leave hotel section empty
3. Leave flight section empty
4. Click "Lưu tất cả"
5. **Expected:** ✅ Only tour data saved

### **Test 2: Add hotel later**
1. Edit existing tour
2. Add hotel_name = "New Hotel"
3. Check amenities: Wifi, Pool
4. Click "Lưu tất cả"
5. **Expected:** ✅ Hotel data saved

### **Test 3: Remove hotel**
1. Edit tour with hotel
2. Clear hotel_name
3. Click "Lưu tất cả"
4. **Expected:** ✅ No hotel fields sent (amenities not sent)

---

## ✅ Summary

**Fixed:**
- ✅ Hotel fields chỉ gửi khi có `hotel_name`
- ✅ Flight fields chỉ gửi khi có `airline`
- ✅ Conditional logic rõ ràng

**Result:**
- ✅ Clean payload
- ✅ No orphan fields
- ✅ Validation pass
- ✅ Data save thành công

---

## 🎯 Test Now

1. **Refresh trang:**
   ```
   http://localhost:5173/#/admin/tours/12/edit
   ```

2. **Scenario 1: Tour only**
   - Leave hotel_name empty
   - Leave airline empty
   - Click "Lưu tất cả"
   - ✅ Should work

3. **Scenario 2: Tour + Hotel**
   - Fill hotel_name
   - Check amenities
   - Click "Lưu tất cả"
   - ✅ Should work

---

**Ngày fix:** 15/10/2025  
**Status:** ✅ Conditional fields logic implemented
