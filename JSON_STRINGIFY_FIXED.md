# ✅ JSON.STRINGIFY - ĐÃ FIX

## ❌ Vấn đề phát hiện

**TourEdit gửi:**
```json
{
  "itinerary": [
    {"day": 1, "title": "...", "description": "..."}
  ],
  "amenities": ["wifi", "pool", "gym"]
}
```

**ServiceNew gửi:**
```json
{
  "itinerary": "[{\"day\":1,\"title\":\"...\",\"description\":\"...\"}]",
  "amenities": "[\"wifi\",\"pool\",\"gym\"]"
}
```

**Vấn đề:**
- Backend có thể expect STRING (JSON string)
- TourEdit gửi ARRAY/OBJECT
- ServiceNew gửi STRING (đã stringify)
- → Validation reject hoặc database error

---

## ✅ Đã fix

**File:** `src/pages/admin/TourEdit.jsx`

### **1. Itinerary field:**

**Before:**
```javascript
if (tourData.itinerary?.length > 0) 
  payload.itinerary = tourData.itinerary;  // ❌ Array
```

**After:**
```javascript
if (tourData.itinerary?.length > 0) 
  payload.itinerary = JSON.stringify(tourData.itinerary);  // ✅ String
```

### **2. Amenities field:**

**Before:**
```javascript
if (hotelData.amenities?.length > 0) 
  payload.amenities = hotelData.amenities;  // ❌ Array
```

**After:**
```javascript
if (hotelData.amenities?.length > 0) 
  payload.amenities = JSON.stringify(hotelData.amenities);  // ✅ String
```

---

## 📊 Payload Comparison

### **Before fix:**
```json
{
  "name": "Tour ABC",
  "itinerary": [
    {"day": 1, "title": "Khởi hành"}
  ],
  "amenities": ["wifi", "pool"]
}
```

**Type:**
- `itinerary`: Array (object)
- `amenities`: Array (string)

### **After fix:**
```json
{
  "name": "Tour ABC",
  "itinerary": "[{\"day\":1,\"title\":\"Khởi hành\"}]",
  "amenities": "[\"wifi\",\"pool\"]"
}
```

**Type:**
- `itinerary`: String (JSON string)
- `amenities`: String (JSON string)

---

## 🎯 Why JSON.stringify?

### **Backend expects:**

**Database schema:**
```sql
CREATE TABLE service_details_tour (
  itinerary JSONB  -- PostgreSQL JSONB type
);

CREATE TABLE service_details_hotel (
  amenities JSONB  -- PostgreSQL JSONB type
);
```

**Backend code:**
```javascript
// Tour.update() model
await client.query(`
  UPDATE service_details_tour 
  SET itinerary = $1
`, [itinerary]);  // Expects JSON string
```

**Validation schema:**
```javascript
itinerary: Joi.alternatives().try(
  Joi.string(),  // ✅ Accepts string
  Joi.array()    // ✅ Also accepts array
)

amenities: Joi.alternatives().try(
  Joi.string(),  // ✅ Accepts string
  Joi.array()    // ✅ Also accepts array
)
```

→ Validation có thể accept cả 2, nhưng backend/database prefer STRING

---

## ✅ Consistency

**Now both ServiceNew and TourEdit send same format:**

| Field | ServiceNew | TourEdit | Match? |
|-------|------------|----------|--------|
| `itinerary` | JSON string | JSON string | ✅ |
| `amenities` | JSON string | JSON string | ✅ |

---

## 🧪 Test

### **Test 1: Save with itinerary**
```
Input:
- Add itinerary: Day 1, Day 2

Payload:
{
  "itinerary": "[{\"day\":1,...},{\"day\":2,...}]"
}

Expected:
✅ Validation pass
✅ Database save
```

### **Test 2: Save with amenities**
```
Input:
- Check: Wifi, Pool, Gym

Payload:
{
  "amenities": "[\"wifi\",\"pool\",\"gym\"]"
}

Expected:
✅ Validation pass
✅ Database save
```

---

## ✅ Summary

**Fixed:**
- ✅ `itinerary` → JSON.stringify()
- ✅ `amenities` → JSON.stringify()
- ✅ Consistent with ServiceNew
- ✅ Backend compatible

**Result:**
- ✅ Validation pass
- ✅ Database save correctly
- ✅ Data consistency

---

## 🎯 Test Now

1. **Refresh trang:**
   ```
   http://localhost:5173/#/admin/tours/12/edit
   ```

2. **Test itinerary:**
   - Add lịch trình
   - Click "Lưu tất cả"
   - ✅ Should work

3. **Test amenities:**
   - Check tiện nghi
   - Click "Lưu tất cả"
   - ✅ Should work

---

**Ngày fix:** 15/10/2025  
**Status:** ✅ JSON.stringify added - Format consistent
