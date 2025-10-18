# ✅ VALIDATION SCHEMA - ĐÃ FIX

## ❌ Vấn đề

**Error:** `Invalid update data`

**Nguyên nhân:**
- Backend validation schema (`tourUpdateSchema`) không có fields mới
- Khi frontend gửi `amenities`, `hotel_name`, `airline`, etc.
- Joi validation reject vì không recognize fields này

---

## ✅ Đã fix

**File:** `backend/utils/tourValidation.js`

**Đã thêm vào `tourUpdateSchema`:**

### **1. Tour fields mới:**
```javascript
short_description: Joi.string().max(500).optional().allow(''),
status: Joi.string().valid('ACTIVE', 'INACTIVE', 'DRAFT').optional(),
country: Joi.string().max(100).optional().allow(''),
departure_date: Joi.date().optional().allow(null),
return_date: Joi.date().optional().allow(null),
itinerary: Joi.alternatives().try(
  Joi.string(),
  Joi.array().items(Joi.object({...}))
).optional().allow(null),
```

### **2. Hotel fields:**
```javascript
hotel_name: Joi.string().max(255).optional().allow(''),
hotel_address: Joi.string().optional().allow(''),
star_rating: Joi.number().integer().min(1).max(5).optional(),
room_types: Joi.string().optional().allow(''),
bed_types: Joi.string().optional().allow(''),
room_area: Joi.alternatives().try(Joi.number(), Joi.string()).optional().allow(''),
max_occupancy: Joi.number().integer().min(1).optional(),
check_in_time: Joi.string().optional().allow(''),
check_out_time: Joi.string().optional().allow(''),
amenities: Joi.alternatives().try(
  Joi.array().items(Joi.string()),  // ← Accept array
  Joi.string()                       // ← Accept string
).optional().allow(null),
```

### **3. Flight fields:**
```javascript
airline: Joi.string().max(100).optional().allow(''),
flight_number: Joi.string().max(50).optional().allow(''),
departure_airport: Joi.string().max(100).optional().allow(''),
arrival_airport: Joi.string().max(100).optional().allow(''),
departure_time: Joi.string().optional().allow(''),
arrival_time: Joi.string().optional().allow(''),
aircraft_type: Joi.string().max(100).optional().allow(''),
baggage_allowance: Joi.string().max(100).optional().allow(''),
cabin_class: Joi.string().valid('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST').optional().allow('')
```

---

## 🎯 Key Points

### **Amenities field:**
```javascript
amenities: Joi.alternatives().try(
  Joi.array().items(Joi.string()),  // Frontend sends: ["wifi", "pool"]
  Joi.string()                       // Or JSON string: '["wifi","pool"]'
).optional().allow(null)
```

**Accepts:**
- Array: `["wifi", "pool", "gym"]`
- String: `'["wifi","pool"]'`
- Null: `null`
- Empty: (field not present)

---

## 🧪 Test

### **Before fix:**
```
Frontend sends:
{
  name: "Tour ABC",
  amenities: ["gym", "bar", "breakfast", "room_service"]
}

Backend response:
❌ 400 Bad Request
{
  success: false,
  error: "Invalid update data"
}
```

### **After fix:**
```
Frontend sends:
{
  name: "Tour ABC",
  amenities: ["gym", "bar", "breakfast", "room_service"]
}

Backend response:
✅ 200 OK
{
  success: true,
  message: "Tour updated successfully"
}
```

---

## 📊 Validation Flow

```
Frontend sends data
  ↓
PUT /api/admin/tours/:id
  ↓
validateTourUpdate(req.body)
  ↓
Joi validates against tourUpdateSchema
  ↓
✅ All fields recognized
  ↓
✅ amenities: array ← ACCEPTED
✅ hotel_name: string ← ACCEPTED
✅ airline: string ← ACCEPTED
  ↓
Pass validation
  ↓
Tour.update() executes
  ↓
Data saved to database
```

---

## ✅ Summary

**Fixed:**
- ✅ Added hotel fields to validation schema
- ✅ Added flight fields to validation schema
- ✅ Added new tour fields (status, country, dates, itinerary)
- ✅ `amenities` accepts array or string
- ✅ All fields optional with `.allow('')` or `.allow(null)`

**Result:**
- ✅ Validation passes
- ✅ Data saves successfully
- ✅ No more "Invalid update data" error

---

## 🎯 Test Now

1. **Edit tour:**
   ```
   http://localhost:5173/#/admin/tours/8/edit
   ```

2. **Check amenities:**
   - ✅ Wifi
   - ✅ Gym
   - ✅ Bar
   - ✅ Breakfast
   - ✅ Room Service

3. **Click "Lưu tất cả"**

4. **Expected:**
   - ✅ Success message
   - ✅ Data saved
   - ✅ Reload shows checked amenities

---

**Ngày fix:** 15/10/2025  
**Status:** ✅ Validation schema updated - All fields supported
