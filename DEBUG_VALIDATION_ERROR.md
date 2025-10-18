# 🐛 DEBUG VALIDATION ERROR

## Đã thêm logging để debug

### **Frontend (TourEdit.jsx):**
```javascript
// Line 178
console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));
```

### **Backend (routes/admin/tours.js):**
```javascript
// Line 480-481
console.error('❌ Validation error:', error.details);
console.error('📦 Request body:', JSON.stringify(req.body, null, 2));
```

---

## 🔍 Steps để debug:

### **1. Mở Console:**
- Frontend: Chrome DevTools (F12) → Console tab
- Backend: Terminal đang chạy `npm run dev`

### **2. Thực hiện lại:**
1. Refresh trang edit tour
2. Chỉnh sửa thông tin
3. Click "Lưu tất cả"
4. Xem console

### **3. Kiểm tra Frontend Console:**

Tìm dòng:
```
📤 Sending payload: {
  "name": "...",
  "short_description": "...",
  ...
}
```

**Copy toàn bộ payload này**

### **4. Kiểm tra Backend Console:**

Tìm dòng:
```
❌ Validation error: [
  {
    "message": "...",
    "path": ["field_name"],
    "type": "..."
  }
]
```

**Xem field nào bị lỗi và lý do**

---

## 🎯 Các lỗi thường gặp:

### **1. Field type sai:**
```
Error: "duration_days" must be a number
→ Fix: Đảm bảo gửi number, không phải string
```

### **2. Field value không hợp lệ:**
```
Error: "status" must be one of [ACTIVE, INACTIVE, DRAFT]
→ Fix: Kiểm tra giá trị status
```

### **3. Field không được phép:**
```
Error: "unknown_field" is not allowed
→ Fix: Field này chưa có trong validation schema
```

### **4. Required field thiếu:**
```
Error: "name" is required
→ Fix: Đảm bảo name không rỗng
```

---

## 📝 Sau khi có log:

**Gửi cho tôi:**
1. Frontend console log (payload)
2. Backend console log (validation error)

**Tôi sẽ fix ngay!**

---

## 🔧 Quick Fix thử:

Nếu lỗi liên quan đến `star_rating` hoặc `max_occupancy`:

### **Sửa TourEdit.jsx:**

```javascript
// Thay vì:
if (hotelData.star_rating) payload.star_rating = hotelData.star_rating;

// Sửa thành:
if (hotelData.hotel_name) {  // Chỉ gửi khi có hotel_name
  if (hotelData.star_rating) payload.star_rating = hotelData.star_rating;
  if (hotelData.max_occupancy) payload.max_occupancy = hotelData.max_occupancy;
}
```

**Lý do:** Tránh gửi hotel fields khi không có hotel data

---

## ✅ Test lại:

1. Refresh trang
2. Edit tour
3. Click "Lưu tất cả"
4. Xem console logs
5. Gửi logs cho tôi nếu vẫn lỗi
