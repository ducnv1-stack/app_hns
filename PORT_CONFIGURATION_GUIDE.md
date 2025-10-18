# 🔧 HƯỚNG DẪN CẤU HÌNH PORT

## ⚠️ Vấn đề vừa gặp

### **Lỗi:**
```
Failed to load tours: TypeError: Failed to fetch
```

### **Nguyên nhân:**
- Backend server đổi port từ **5000** → **3000**
- Frontend vẫn gọi API ở port **5000**
- → Không kết nối được

---

## ✅ Giải pháp đã áp dụng

### **Đổi lại port backend về 5000**

**File:** `backend/server.js`

```javascript
// Trước (SAI)
const PORT = process.env.PORT || 3000;

// Sau (ĐÚNG)
const PORT = process.env.PORT || 5000;
```

---

## 🔍 Cấu hình Port trong hệ thống

### **1. Backend Server**

**File:** `backend/server.js`
```javascript
const PORT = process.env.PORT || 5000;
```

**URL:** `http://localhost:5000`

**Endpoints:**
- Health: `http://localhost:5000/api/health`
- Tours: `http://localhost:5000/api/tours`
- Auth: `http://localhost:5000/api/auth`
- Bookings: `http://localhost:5000/api/bookings`
- Payments: `http://localhost:5000/api/payments`

---

### **2. Frontend (Vite)**

**Port:** 5173 (default Vite)

**URL:** `http://localhost:5173`

**API Config:** `src/config/env.js`
```javascript
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
};
```

---

### **3. Database (PostgreSQL)**

**Port:** 5432 (default PostgreSQL)

**Connection:** `backend/config/database.js`
```javascript
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});
```

---

## 📊 Port Summary

| Service | Port | URL |
|---------|------|-----|
| **Frontend (Vite)** | 5173 | http://localhost:5173 |
| **Backend (Express)** | 5000 | http://localhost:5000 |
| **Database (PostgreSQL)** | 5432 | localhost:5432 |

---

## 🔄 Nếu muốn đổi port

### **Option 1: Đổi port Backend**

#### **Bước 1:** Sửa `backend/server.js`
```javascript
const PORT = process.env.PORT || 3000; // Đổi sang 3000
```

#### **Bước 2:** Sửa `frontend/src/config/env.js`
```javascript
export const config = {
  API_BASE_URL: 'http://localhost:3000/api' // Đổi sang 3000
};
```

#### **Bước 3:** Sửa `.env` (nếu có)
```bash
VITE_API_URL=http://localhost:3000/api
```

#### **Bước 4:** Restart cả Backend và Frontend
```bash
# Backend
cd backend
node server.js

# Frontend
cd app_hns/HaNoiSun-main
npm run dev
```

---

### **Option 2: Đổi port Frontend**

#### **Bước 1:** Sửa `vite.config.js`
```javascript
export default defineConfig({
  server: {
    port: 3000 // Đổi từ 5173 sang 3000
  }
});
```

#### **Bước 2:** Sửa CORS trong `backend/server.js`
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000', // Thêm port mới
    'http://localhost:5173'
  ]
}));
```

---

## 🧪 Kiểm tra Port

### **1. Kiểm tra Backend:**
```bash
# Health check
curl http://localhost:5000/api/health

# Hoặc
netstat -ano | findstr :5000
```

**Expected:**
```json
{
  "status": "OK",
  "message": "HNS Booking Tour API is running"
}
```

### **2. Kiểm tra Frontend:**
```bash
# Mở browser
http://localhost:5173

# Hoặc
netstat -ano | findstr :5173
```

### **3. Kiểm tra Database:**
```bash
psql -h localhost -p 5432 -U postgres -d hns_booking
```

---

## 🚨 Troubleshooting

### **Lỗi: "Failed to fetch"**

**Nguyên nhân:**
- Backend không chạy
- Port không khớp
- CORS chưa config

**Giải pháp:**
1. Check backend đang chạy: `netstat -ano | findstr :5000`
2. Check API URL trong frontend: `src/config/env.js`
3. Check CORS trong backend: `server.js`

---

### **Lỗi: "Port already in use"**

**Nguyên nhân:**
- Port đã được process khác sử dụng

**Giải pháp:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Hoặc đổi port khác
```

---

### **Lỗi: "CORS policy"**

**Nguyên nhân:**
- Frontend URL chưa được thêm vào CORS whitelist

**Giải pháp:**
```javascript
// backend/server.js
app.use(cors({
  origin: [
    'http://localhost:5173', // Thêm frontend URL
    'http://127.0.0.1:5173'
  ],
  credentials: true
}));
```

---

## ✅ Best Practices

### **1. Sử dụng Environment Variables**

**Backend `.env`:**
```bash
PORT=5000
DB_PORT=5432
```

**Frontend `.env`:**
```bash
VITE_API_URL=http://localhost:5000/api
```

### **2. Document Port Configuration**

Luôn ghi chú port trong README:
```markdown
## Ports
- Frontend: 5173
- Backend: 5000
- Database: 5432
```

### **3. Consistent Naming**

```
Development:
- Frontend: localhost:5173
- Backend: localhost:5000

Production:
- Frontend: https://hanoisun.com
- Backend: https://api.hanoisun.com
```

---

## 📝 Checklist

Khi thay đổi port, check:

- [ ] Backend `server.js` - PORT variable
- [ ] Frontend `env.js` - API_BASE_URL
- [ ] Backend CORS - origin array
- [ ] Environment files (.env)
- [ ] Documentation (README)
- [ ] Restart cả Backend và Frontend

---

## 🎯 Kết luận

**Port mặc định của hệ thống:**
- Frontend: **5173**
- Backend: **5000**
- Database: **5432**

**Khi đổi port, nhớ:**
1. Đổi cả Backend và Frontend config
2. Update CORS settings
3. Restart services
4. Test API connection

---

**Ngày cập nhật:** 15/10/2025  
**Status:** ✅ Backend đang chạy trên port 5000
