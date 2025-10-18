# 🔐 Authentication & Authorization Fix - Changelog

**Ngày thực hiện**: 2025-10-10  
**Người thực hiện**: AI Assistant

---

## 📋 Tóm tắt thay đổi

Đã sửa 3 vấn đề chính về authentication và authorization trong hệ thống:

1. ✅ Xóa unused `role` parameter trong login flow
2. ✅ Fix `/api/auth/me` endpoint trả về `roles` thay vì `role`
3. ✅ Thêm middleware authentication cho protected routes ở backend

---

## 🔧 Chi tiết thay đổi

### 1. Xóa unused `role` parameter

#### **File: `app_hns/HaNoiSun-main/src/services/authService.js`**

**Trước:**
```javascript
login: async (credentials) => {
  const { email, password, role = 'user' } = credentials;
  const response = await api.post('/auth/login', { email, password, role });
}
```

**Sau:**
```javascript
login: async (credentials) => {
  const { email, password } = credentials;
  const response = await api.post('/auth/login', { email, password });
}
```

**Lý do**: 
- Parameter `role` không được backend sử dụng
- Backend lấy roles từ database, không cho phép user tự chọn
- Xóa để tránh nhầm lẫn và code rõ ràng hơn

---

#### **File: `backend/routes/auth.js`**

**Trước:**
```javascript
router.post('/login', async (req, res) => {
  const { email, password, role = 'user' } = req.body;
  // role không được sử dụng trong code
}
```

**Sau:**
```javascript
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Chỉ nhận email và password
}
```

---

### 2. Fix `/api/auth/me` endpoint

#### **File: `backend/routes/auth.js`**

**Trước:**
```javascript
res.json({
  success: true,
  data: {
    id: user.id,
    name: user.full_name,
    email: user.email,
    phone: user.phone_number,
    role: decoded.role || 'user' // ❌ decoded.role không tồn tại
  }
});
```

**Sau:**
```javascript
res.json({
  success: true,
  data: {
    id: user.id,
    name: user.full_name,
    email: user.email,
    phone: user.phone_number,
    roles: decoded.roles || [] // ✅ Đúng format
  }
});
```

**Lý do**:
- JWT payload chứa `roles` (array): `['admin']` hoặc `['user']`
- Code cũ dùng `decoded.role` (không tồn tại) → trả về `undefined`
- Fallback về `'user'` → admin bị nhận dạng sai thành user
- Fix: Dùng `decoded.roles` và trả về array

**Impact**:
- Admin giờ được nhận dạng đúng khi gọi `/api/auth/me`
- Frontend có thể check roles chính xác

---

### 3. Thêm middleware authentication

#### **File mới: `backend/middleware/auth.js`**

Tạo 3 middleware functions:

**a) `authenticate`**
- Verify JWT token từ header `Authorization: Bearer <token>`
- Gắn user info vào `req.user`
- Trả về 401 nếu token invalid

**b) `authorize(allowedRoles)`**
- Kiểm tra user có role phù hợp không
- Trả về 403 nếu không đủ quyền

**c) `optionalAuth`**
- Authentication không bắt buộc
- Không fail nếu không có token

---

#### **File: `backend/routes/bookings.js`**

**Thay đổi**:
```javascript
// Import middleware
const { authenticate, authorize } = require('../middleware/auth');

// Áp dụng cho routes
router.get('/', authenticate, authorize(['admin']), ...);      // Admin only
router.get('/:id', authenticate, ...);                         // Authenticated users
router.post('/', authenticate, ...);                           // Authenticated users
router.put('/:id/status', authenticate, authorize(['admin']), ...); // Admin only
```

**Trước đây**: Ai cũng có thể gọi API (không có bảo vệ)  
**Bây giờ**: Phải login và có quyền phù hợp

---

#### **File: `backend/routes/users.js`**

**Thay đổi**:
```javascript
// Import middleware
const { authenticate, authorize } = require('../middleware/auth');

// Thay đổi từ req.query.userId sang req.user.userId
router.get('/profile', authenticate, async (req, res) => {
  const userId = req.user.userId; // ✅ Từ JWT token
  // Trước: const userId = req.query.userId || 1; ❌
});

router.put('/profile', authenticate, ...);
router.get('/addresses', authenticate, ...);
router.post('/addresses', authenticate, ...);
router.get('/bookings', authenticate, ...);
```

**Bảo mật cải thiện**:
- User không thể fake `userId` trong query string
- `userId` được lấy từ JWT token (đã verify)
- User chỉ xem được data của chính mình

---

#### **File: `backend/routes/admin/tours.js`**

**Trước:**
```javascript
// Custom middleware (duplicate code)
const authenticateAdmin = async (req, res, next) => {
  // 40 dòng code tự implement authentication
};
router.use(authenticateAdmin);
```

**Sau:**
```javascript
// Sử dụng shared middleware
const { authenticate, authorize } = require('../../middleware/auth');

router.use(authenticate);
router.use(authorize(['admin']));
```

**Lợi ích**:
- Giảm code duplication
- Consistent authentication logic
- Dễ maintain hơn

---

## 📊 Routes được bảo vệ

### ✅ Đã áp dụng middleware:

| Route | Method | Permission | Middleware |
|-------|--------|------------|------------|
| `/api/bookings` | GET | Admin only | `authenticate, authorize(['admin'])` |
| `/api/bookings/:id` | GET | Authenticated | `authenticate` |
| `/api/bookings` | POST | Authenticated | `authenticate` |
| `/api/bookings/:id/status` | PUT | Admin only | `authenticate, authorize(['admin'])` |
| `/api/users/profile` | GET | Authenticated | `authenticate` |
| `/api/users/profile` | PUT | Authenticated | `authenticate` |
| `/api/users/addresses` | GET | Authenticated | `authenticate` |
| `/api/users/addresses` | POST | Authenticated | `authenticate` |
| `/api/users/bookings` | GET | Authenticated | `authenticate` |
| `/api/admin/tours/*` | ALL | Admin only | `authenticate, authorize(['admin'])` |

### ⚠️ Chưa áp dụng (cần review):

- `/api/tours/*` - Hiện tại public (có thể giữ nguyên)
- `/api/payments/*` - Cần thêm authentication

---

## 🧪 Testing

### Test Cases đã verify:

1. **Login flow**:
   - ✅ Login với admin account → nhận roles: ['admin']
   - ✅ Login với user account → nhận roles: ['user']
   - ✅ Token được generate đúng format

2. **Protected routes**:
   - ✅ Gọi API không có token → 401 Unauthorized
   - ✅ Gọi API với invalid token → 401 Unauthorized
   - ✅ User gọi admin route → 403 Forbidden
   - ✅ Admin gọi admin route → 200 OK

3. **User data**:
   - ✅ `/api/auth/me` trả về `roles` array
   - ✅ User chỉ xem được profile của mình
   - ✅ Admin có thể xem tất cả bookings

---

## 🔄 Migration Guide

### Cho Frontend Developers:

**Không cần thay đổi gì!** 
- Frontend đã gửi token đúng format
- API response format không đổi (trừ `/api/auth/me` giờ trả về `roles` thay vì `role`)

### Cho Backend Developers:

**Khi thêm route mới:**

```javascript
// Public route (không cần login)
router.get('/tours', async (req, res) => { ... });

// Authenticated route (cần login)
router.get('/profile', authenticate, async (req, res) => {
  const userId = req.user.userId; // Lấy từ token
  // ...
});

// Admin only route
router.post('/admin/tours', authenticate, authorize(['admin']), async (req, res) => {
  // ...
});

// Mixed permissions
router.get('/bookings/:id', authenticate, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  
  // Check ownership
  if (booking.user_id !== req.user.userId && !req.user.roles.includes('admin')) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.json({ data: booking });
});
```

---

## 📚 Documentation

Đã tạo file hướng dẫn chi tiết:
- **`backend/middleware/README.md`** - Hướng dẫn sử dụng middleware
- **`backend/middleware/auth.js`** - Source code middleware với comments

---

## ⚠️ Breaking Changes

### Không có breaking changes cho Frontend!

Tuy nhiên, có 1 thay đổi nhỏ:

**`/api/auth/me` response:**
```javascript
// Trước
{
  "data": {
    "role": "user" // ❌ String
  }
}

// Sau
{
  "data": {
    "roles": ["user"] // ✅ Array
  }
}
```

**Action required**: 
- Nếu frontend code có dùng `user.role` → đổi thành `user.roles[0]` hoặc `user.roles.includes('admin')`
- Kiểm tra file `AuthContext.jsx` và các components sử dụng user data

---

## 🔒 Security Improvements

1. **Không thể bypass authentication**:
   - Trước: Gọi trực tiếp API → tạo được booking
   - Sau: Phải có valid JWT token

2. **Không thể fake userId**:
   - Trước: `?userId=999` → xem data của user khác
   - Sau: userId từ JWT token → không thể fake

3. **Role-based access control**:
   - Trước: Frontend check roles (có thể bypass)
   - Sau: Backend enforce roles → bảo mật

4. **Consistent authentication**:
   - Trước: Mỗi route tự implement (inconsistent)
   - Sau: Shared middleware (consistent)

---

## 📝 Next Steps

### Khuyến nghị tiếp theo:

1. **Thêm middleware cho payments routes**:
   ```javascript
   // routes/payments.js
   router.post('/', authenticate, ...);
   router.get('/:id', authenticate, ...);
   ```

2. **Implement refresh token**:
   - Hiện tại: JWT token expire sau 7 ngày
   - Cải thiện: Refresh token để tự động renew

3. **Add rate limiting per user**:
   - Hiện tại: Rate limit per IP
   - Cải thiện: Rate limit per userId

4. **Audit logging**:
   - Log authentication events
   - Log authorization failures
   - Track admin actions

5. **Add unit tests**:
   - Test middleware functions
   - Test protected routes
   - Test role-based access

---

## 🎯 Summary

**Đã fix**:
- ✅ Xóa unused `role` parameter
- ✅ Fix `/api/auth/me` trả về đúng `roles` array
- ✅ Thêm authentication middleware cho backend routes
- ✅ Bảo vệ user routes (profile, addresses, bookings)
- ✅ Bảo vệ admin routes (tour management)
- ✅ Tạo documentation đầy đủ

**Kết quả**:
- Hệ thống bảo mật hơn
- Code rõ ràng, dễ maintain hơn
- Consistent authentication logic
- Admin và User được phân biệt rõ ràng

**Files changed**: 7 files
- Modified: 5 files
- Created: 2 files (middleware/auth.js, middleware/README.md)
