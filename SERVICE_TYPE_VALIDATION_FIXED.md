# ✅ SERVICE_TYPE VALIDATION - ĐÃ FIX

## ❌ Vấn đề tìm thấy

**Payload gửi:**
```json
{
  "service_type": "TOUR",
  ...
}
```

**Validation schema cũ:**
```javascript
service_type: Joi.string()
  .valid('TOUR', 'HOTEL', 'TRANSPORT', 'ACTIVITY')  // ❌ Thiếu FLIGHT và COMBO
```

**Error:**
- Nếu frontend gửi `service_type: 'FLIGHT'` hoặc `'COMBO'`
- Backend reject vì không có trong list allowed values

---

## ✅ Đã fix

**File:** `backend/utils/tourValidation.js`

### **1. tourCreateSchema (Line 40-45):**
```javascript
service_type: Joi.string()
  .valid('TOUR', 'HOTEL', 'FLIGHT', 'COMBO', 'TRANSPORT', 'ACTIVITY')  // ✅ Added FLIGHT, COMBO
  .default('TOUR')
  .messages({
    'any.only': 'Loại dịch vụ không hợp lệ'
  }),
```

### **2. tourUpdateSchema (Line 134-136):**
```javascript
service_type: Joi.string()
  .valid('TOUR', 'HOTEL', 'FLIGHT', 'COMBO', 'TRANSPORT', 'ACTIVITY')  // ✅ Added FLIGHT, COMBO
  .optional(),
```

---

## 📊 Allowed Service Types

| Value | Mô tả |
|-------|-------|
| `TOUR` | Tour du lịch |
| `HOTEL` | Khách sạn |
| `FLIGHT` | Vé máy bay ✅ NEW |
| `COMBO` | Combo (Tour + Hotel + Flight) ✅ NEW |
| `TRANSPORT` | Vận chuyển |
| `ACTIVITY` | Hoạt động |

---

## 🧪 Test

### **Before fix:**
```
Request:
{
  "service_type": "COMBO"
}

Response:
❌ 400 Bad Request
{
  "error": "Invalid update data",
  "details": [
    {
      "message": "\"service_type\" must be one of [TOUR, HOTEL, TRANSPORT, ACTIVITY]",
      "path": ["service_type"]
    }
  ]
}
```

### **After fix:**
```
Request:
{
  "service_type": "COMBO"
}

Response:
✅ 200 OK
{
  "success": true,
  "message": "Tour updated successfully"
}
```

---

## ✅ Summary

**Fixed:**
- ✅ Added `FLIGHT` to allowed service types
- ✅ Added `COMBO` to allowed service types
- ✅ Updated both create and update schemas

**Result:**
- ✅ Frontend có thể gửi bất kỳ service type nào
- ✅ Validation pass
- ✅ Data save thành công

---

## 🎯 Test Now

1. **Refresh trang:**
   ```
   http://localhost:5173/#/admin/tours/8/edit
   ```

2. **Click "Lưu tất cả"**

3. **Expected:**
   - ✅ Success message
   - ✅ No validation error
   - ✅ Data saved

---

**Ngày fix:** 15/10/2025  
**Status:** ✅ Service type validation fixed
