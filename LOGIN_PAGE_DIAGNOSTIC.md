# 🔍 CHẨN ĐOÁN LOGIN PAGE

## ❌ Vấn đề phát hiện

### **Lỗi:** `TypeError: Failed to fetch`

**Nguyên nhân:** Backend server không chạy trên port 5000

---

## 📊 Phân tích lỗi

### **1. Error Stack Trace:**
```
AuthService: Error during login: TypeError: Failed to fetch
  at apiRequest (api.js:26:28)
  at Object.post (api.js:63:12)
  at authService.login (authService.js:11:34)
  at login (AuthContext.jsx:43:42)
  at handleSubmit (LoginPage.jsx:33:35)
```

### **2. Luồng xử lý:**
```
LoginPage.jsx (handleSubmit)
  ↓
AuthContext.jsx (login)
  ↓
authService.js (login)
  ↓
api.js (post)
  ↓
fetch('http://localhost:5000/api/auth/login')
  ↓
❌ FAILED: Backend không chạy
```

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
# Kiểm tra port 5000
netstat -ano | findstr :5000

# Hoặc test API
curl http://localhost:5000/api/health
```

### **Bước 3: Test Login API**

```bash
# Test với curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@hanoisuntravel.com\",\"password\":\"admin123\"}"
```

---

## 🔧 Cấu hình hiện tại

### **Frontend:**
- **URL:** `http://localhost:5173`
- **API Base URL:** `http://localhost:5000/api`
- **Config file:** `src/config/env.js`

```javascript
export const config = {
  API_BASE_URL: 'http://localhost:5000/api'
};
```

### **Backend:**
- **Port:** 5000
- **Login endpoint:** `POST /api/auth/login`
- **Expected payload:**
  ```json
  {
    "email": "admin@hanoisuntravel.com",
    "password": "admin123"
  }
  ```

---

## 📝 Login Flow

### **1. User nhập thông tin:**
```
Email: admin@hanoisuntravel.com
Password: ••••••••
```

### **2. Frontend gửi request:**
```javascript
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@hanoisuntravel.com",
  "password": "admin123"
}
```

### **3. Backend xử lý:**
```javascript
// routes/auth.js
router.post('/login', async (req, res) => {
  // 1. Validate email & password
  // 2. Check user exists
  // 3. Verify password
  // 4. Generate JWT token
  // 5. Return user data + token
});
```

### **4. Backend response (success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "admin@hanoisuntravel.com",
      "username": "admin",
      "roles": ["admin"],
      "full_name": "Administrator"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### **5. Frontend lưu token:**
```javascript
// AuthContext.jsx
localStorage.setItem('hns_auth_token', response.data.token);
localStorage.setItem('hns_auth_state', JSON.stringify({
  isAuthenticated: true,
  user: response.data.user,
  token: response.data.token
}));
```

### **6. Redirect:**
```javascript
// LoginPage.jsx
if (user.roles.includes('admin')) {
  navigate('/admin/dashboard');
} else {
  navigate('/dashboard');
}
```

---

## 🧪 Test Cases

### **Test 1: Backend Health Check**
```bash
curl http://localhost:5000/api/health
```
**Expected:** `{"status":"ok"}`

### **Test 2: Login với admin**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@hanoisuntravel.com\",\"password\":\"admin123\"}"
```
**Expected:** Token + user data

### **Test 3: Login với user thường**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user1@demo.com\",\"password\":\"user123\"}"
```
**Expected:** Token + user data (no admin role)

### **Test 4: Login với credentials sai**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"wrong@email.com\",\"password\":\"wrongpass\"}"
```
**Expected:** Error 401 Unauthorized

---

## 🔍 Debug Checklist

### **Frontend:**
- ✅ LoginPage component có render đúng
- ✅ Form validation hoạt động
- ✅ API service config đúng URL
- ✅ AuthContext lưu token vào localStorage
- ✅ Error handling hiển thị lỗi cho user

### **Backend:**
- ❌ **Server không chạy** ← VẤN ĐỀ CHÍNH
- ⚠️ Cần kiểm tra: Database connection
- ⚠️ Cần kiểm tra: Auth routes registered
- ⚠️ Cần kiểm tra: CORS configuration

### **Network:**
- ⚠️ Cần kiểm tra: Firewall blocking port 5000
- ⚠️ Cần kiểm tra: CORS headers
- ⚠️ Cần kiểm tra: Request/Response format

---

## 📋 Thông tin Demo Accounts

### **Admin Account:**
```
Email: admin@hanoisuntravel.com
Password: admin123
Roles: ['admin']
```

### **User Account:**
```
Email: user1@demo.com
Password: user123
Roles: ['user']
```

---

## 🚀 Quick Fix

### **1. Start Backend:**
```powershell
cd d:\Project\HNS\backend
node server.js
```

### **2. Verify Backend:**
```powershell
# Check if running
netstat -ano | findstr :5000

# Test health endpoint
curl http://localhost:5000/api/health
```

### **3. Test Login:**
Mở browser → `http://localhost:5173/login`
- Email: `admin@hanoisuntravel.com`
- Password: `admin123`
- Click "Đăng nhập"

### **4. Expected Result:**
- ✅ No "Failed to fetch" error
- ✅ Redirect to `/admin/dashboard`
- ✅ User info displayed in header

---

## 📊 Console Logs

### **Successful Login:**
```
🔐 AuthService: Making login request with: { email: 'admin@...', password: '***' }
🌐 API Request: { url: 'http://localhost:5000/api/auth/login', method: 'POST' }
🌐 API Response status: 200 OK
✅ API Success response: { success: true, data: {...} }
🔐 AuthService: Token and user data stored
🔐 Login response: { success: true, data: {...} }
🔄 Setting new auth state: { isAuthenticated: true, user: {...}, token: '...' }
✅ Login successful, user: { id: 1, email: '...', roles: ['admin'] }
🚀 Navigation decision: { userRoles: ['admin'], isAdmin: true }
🔑 Admin user detected - Redirecting to /admin/dashboard
```

### **Failed Login (Backend down):**
```
🔐 AuthService: Making login request with: { email: 'admin@...', password: '***' }
🌐 API Request: { url: 'http://localhost:5000/api/auth/login', method: 'POST' }
❌ API Request failed: TypeError: Failed to fetch
❌ AuthService: Error during login: TypeError: Failed to fetch
❌ Login error: TypeError: Failed to fetch
```

---

## ✅ Kết luận

**Vấn đề:** Backend server không chạy

**Giải pháp:** Khởi động backend server

**Command:**
```bash
cd d:\Project\HNS\backend
node server.js
```

**Sau khi backend chạy:**
- ✅ Login page sẽ hoạt động bình thường
- ✅ Không còn lỗi "Failed to fetch"
- ✅ User có thể login thành công
- ✅ Redirect đến dashboard đúng role

---

**Ngày tạo:** 15/10/2025  
**Status:** ❌ Backend cần khởi động
