# 🔧 FIX LỖI TRANG SỬA TOUR

## ❌ Lỗi gặp phải

### **Error Message:**
```
Failed to fetch
GET http://localhost:5173/ net::ERR_CONNECTION_REFUSED
```

### **Nguyên nhân:**
Backend server **không chạy** hoặc đã bị tắt

---

## ✅ Giải pháp

### **Bước 1: Khởi động Backend**

```bash
cd d:\Project\HNS\backend
node server.js
```

**Hoặc:**

```bash
cd d:\Project\HNS\backend
npm start
```

### **Bước 2: Kiểm tra Backend đang chạy**

```bash
# Check port 5000
netstat -ano | findstr :5000

# Hoặc test API
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "OK",
  "message": "HNS Booking Tour API is running"
}
```

### **Bước 3: Refresh trang sửa tour**

1. Mở browser
2. Vào trang: `http://localhost:5173/admin/tours/12/edit`
3. Refresh (F5 hoặc Ctrl+R)
4. Lỗi sẽ biến mất

---

## 🔍 Chi tiết lỗi

### **API Call Flow:**

```
TourEdit.jsx
  ↓
adminTourService.getTourContent(id)
  ↓
api.get('/admin/tours/12/content')
  ↓
http://localhost:5000/api/admin/tours/12/content
  ↓
❌ ERR_CONNECTION_REFUSED (Backend không chạy)
```

### **Backend Endpoint:**

**File:** `backend/routes/admin/tours.js`

```javascript
// GET /api/admin/tours/:id/content
router.get('/:id/content', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Query tour data with all details
    const tour = await Tour.findById(id);
    
    res.json({
      success: true,
      data: tour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tour content'
    });
  }
});
```

---

## 🚨 Các lỗi thường gặp

### **1. Backend không chạy**

**Triệu chứng:**
- `ERR_CONNECTION_REFUSED`
- `Failed to fetch`
- `net::ERR_CONNECTION_RESET`

**Giải pháp:**
```bash
cd backend
node server.js
```

---

### **2. Backend chạy sai port**

**Triệu chứng:**
- Backend chạy port 3000
- Frontend gọi port 5000

**Giải pháp:**
```javascript
// backend/server.js
const PORT = process.env.PORT || 5000; // ← Phải là 5000
```

---

### **3. CORS Error**

**Triệu chứng:**
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Giải pháp:**
```javascript
// backend/server.js
app.use(cors({
  origin: ['http://localhost:5173'], // ← Thêm frontend URL
  credentials: true
}));
```

---

### **4. Authentication Error**

**Triệu chứng:**
```
401 Unauthorized
Authentication required
```

**Giải pháp:**
- Đảm bảo đã login
- Token được lưu trong localStorage
- Header Authorization được gửi đúng

---

## 🧪 Testing

### **Test Backend:**

```bash
# 1. Health check
curl http://localhost:5000/api/health

# 2. Test admin endpoint (cần token)
# Login trước để lấy token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@hanoisuntravel.com\",\"password\":\"admin123\"}"

# 3. Test tour content endpoint
curl http://localhost:5000/api/admin/tours/12/content \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Test Frontend:**

1. Mở DevTools (F12)
2. Tab Network
3. Refresh trang
4. Xem request `/admin/tours/12/content`
5. Check:
   - ✅ Status: 200 OK
   - ✅ Response có data
   - ❌ Status: Failed (Backend không chạy)

---

## 📋 Checklist

Khi gặp lỗi "Failed to fetch":

- [ ] Backend đang chạy? (`netstat -ano | findstr :5000`)
- [ ] Backend chạy đúng port 5000?
- [ ] Frontend gọi đúng URL? (`http://localhost:5000`)
- [ ] CORS đã config? (origin: localhost:5173)
- [ ] Đã login? (có token trong localStorage)
- [ ] Network tab có lỗi gì?

---

## 🔧 Quick Fix Commands

### **Windows PowerShell:**

```powershell
# Stop tất cả node processes
Stop-Process -Name node -Force

# Start backend
cd d:\Project\HNS\backend
node server.js

# Trong terminal khác, start frontend
cd d:\Project\HNS\app_hns\HaNoiSun-main
npm run dev
```

### **Check Services:**

```powershell
# Check backend
curl http://localhost:5000/api/health

# Check frontend
curl http://localhost:5173
```

---

## 📊 Service Status

### **Cần chạy đồng thời:**

| Service | Port | Command | Status Check |
|---------|------|---------|--------------|
| **Backend** | 5000 | `node server.js` | `curl localhost:5000/api/health` |
| **Frontend** | 5173 | `npm run dev` | `curl localhost:5173` |
| **Database** | 5432 | PostgreSQL service | `psql -h localhost -p 5432` |

---

## ✅ Kết quả sau khi fix

### **Backend Console:**
```
🚀 Server running on port 5000
📊 Environment: development
🔗 API URL: http://localhost:5000/api
✅ Connected to PostgreSQL database
```

### **Frontend:**
- Trang sửa tour load thành công
- Hiển thị thông tin tour
- Không còn lỗi "Failed to fetch"
- Slideshow ảnh hoạt động

### **Browser DevTools:**
```
GET http://localhost:5000/api/admin/tours/12/content
Status: 200 OK
Response: { success: true, data: {...} }
```

---

## 🎯 Tóm tắt

**Lỗi:** Backend không chạy → Frontend không kết nối được

**Fix:** 
1. Start backend: `node server.js`
2. Verify: `curl http://localhost:5000/api/health`
3. Refresh trang sửa tour

**Nguyên tắc:** Backend phải chạy TRƯỚC khi mở trang admin!

---

**Ngày cập nhật:** 15/10/2025  
**Status:** ✅ Backend đã khởi động thành công
