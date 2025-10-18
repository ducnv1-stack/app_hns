# Authentication & Authorization Middleware

## 📝 Tổng quan

Middleware này cung cấp authentication (xác thực) và authorization (phân quyền) cho backend API.

---

## 🔐 Middleware có sẵn

### 1. `authenticate`
**Mục đích**: Xác thực user qua JWT token

**Cách hoạt động**:
- Lấy token từ header `Authorization: Bearer <token>`
- Verify token với `JWT_SECRET`
- Gắn thông tin user vào `req.user`
- Nếu token invalid → trả về 401 Unauthorized

**Sử dụng**:
```javascript
const { authenticate } = require('../middleware/auth');

// Bảo vệ 1 route
router.get('/profile', authenticate, async (req, res) => {
  const userId = req.user.userId; // ✅ Lấy từ JWT token
  // ...
});
```

**req.user structure**:
```javascript
{
  userId: 1,
  email: 'user@example.com',
  roles: ['user'] // hoặc ['admin']
}
```

---

### 2. `authorize(allowedRoles)`
**Mục đích**: Kiểm tra user có role phù hợp không

**Tham số**:
- `allowedRoles`: Array các role được phép (ví dụ: `['admin']`, `['user', 'admin']`)

**Cách hoạt động**:
- Kiểm tra `req.user.roles` có chứa ít nhất 1 role trong `allowedRoles`
- Nếu không có quyền → trả về 403 Forbidden

**Sử dụng**:
```javascript
const { authenticate, authorize } = require('../middleware/auth');

// Chỉ admin mới truy cập được
router.post('/admin/tours', authenticate, authorize(['admin']), async (req, res) => {
  // Chỉ chạy nếu user có role 'admin'
});

// Cả user và admin đều truy cập được
router.get('/bookings', authenticate, authorize(['user', 'admin']), async (req, res) => {
  // Chạy nếu user có role 'user' HOẶC 'admin'
});
```

---

### 3. `optionalAuth`
**Mục đích**: Authentication không bắt buộc

**Cách hoạt động**:
- Nếu có token → verify và gắn vào `req.user`
- Nếu không có token hoặc invalid → `req.user = null` và **KHÔNG** trả về lỗi

**Sử dụng**:
```javascript
const { optionalAuth } = require('../middleware/auth');

// Route hoạt động khác nhau cho authenticated vs non-authenticated users
router.get('/tours', optionalAuth, async (req, res) => {
  if (req.user) {
    // User đã login → hiển thị giá đặc biệt
  } else {
    // User chưa login → hiển thị giá thông thường
  }
});
```

---

## 📚 Ví dụ thực tế

### Ví dụ 1: Protected User Route
```javascript
// routes/users.js
const { authenticate } = require('../middleware/auth');

// User chỉ có thể xem profile của chính mình
router.get('/profile', authenticate, async (req, res) => {
  const userId = req.user.userId; // ✅ Từ JWT token
  
  // Lấy thông tin user từ database
  const user = await User.findById(userId);
  res.json({ success: true, data: user });
});
```

### Ví dụ 2: Admin Only Route
```javascript
// routes/admin/tours.js
const { authenticate, authorize } = require('../../middleware/auth');

// Chỉ admin mới tạo được tour
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  // req.user.roles chắc chắn chứa 'admin'
  const tour = await Tour.create(req.body);
  res.json({ success: true, data: tour });
});
```

### Ví dụ 3: Apply cho tất cả routes trong router
```javascript
// routes/admin/tours.js
const router = express.Router();

// Áp dụng cho TẤT CẢ routes trong file này
router.use(authenticate);
router.use(authorize(['admin']));

// Tất cả routes bên dưới đều yêu cầu admin
router.get('/', async (req, res) => { /* ... */ });
router.post('/', async (req, res) => { /* ... */ });
router.put('/:id', async (req, res) => { /* ... */ });
router.delete('/:id', async (req, res) => { /* ... */ });
```

### Ví dụ 4: Mixed Permissions
```javascript
// routes/bookings.js
const { authenticate, authorize } = require('../middleware/auth');

// Admin xem tất cả bookings
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  const bookings = await Booking.findAll();
  res.json({ success: true, data: bookings });
});

// User và Admin đều xem được booking detail
router.get('/:id', authenticate, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  
  // Kiểm tra ownership
  if (booking.buyer_id !== req.user.userId && !req.user.roles.includes('admin')) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.json({ success: true, data: booking });
});

// Authenticated users tạo booking
router.post('/', authenticate, async (req, res) => {
  const booking = await Booking.create({
    ...req.body,
    buyer_id: req.user.userId // ✅ Từ JWT token
  });
  res.json({ success: true, data: booking });
});
```

---

## ⚠️ Lưu ý quan trọng

### 1. Thứ tự middleware
```javascript
// ✅ ĐÚNG: authenticate trước, authorize sau
router.post('/', authenticate, authorize(['admin']), handler);

// ❌ SAI: authorize trước sẽ lỗi vì req.user chưa có
router.post('/', authorize(['admin']), authenticate, handler);
```

### 2. Frontend phải gửi token
```javascript
// Frontend phải gửi token trong header
const response = await fetch('/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### 3. Error Handling
Middleware tự động trả về lỗi:
- **401 Unauthorized**: Không có token hoặc token invalid
- **403 Forbidden**: Có token nhưng không đủ quyền

```javascript
// Response khi không có token
{
  "success": false,
  "error": "No token provided. Please login to access this resource."
}

// Response khi token expired
{
  "success": false,
  "error": "Token expired. Please login again."
}

// Response khi không đủ quyền
{
  "success": false,
  "error": "Access denied. You do not have permission to access this resource.",
  "requiredRoles": ["admin"],
  "yourRoles": ["user"]
}
```

---

## 🔧 Testing

### Test với curl
```bash
# 1. Login để lấy token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hanoisuntravel.com","password":"admin123"}'

# Response: { "success": true, "data": { "token": "eyJhbGc..." } }

# 2. Sử dụng token để gọi protected route
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer eyJhbGc..."

# 3. Test admin route với user token (sẽ bị 403)
curl -X POST http://localhost:5000/api/admin/tours \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Tour"}'
```

### Test với Postman
1. Login qua `/api/auth/login`
2. Copy token từ response
3. Trong Postman:
   - Tab **Authorization**
   - Type: **Bearer Token**
   - Paste token vào
4. Gọi protected routes

---

## 📊 Routes đã được bảo vệ

### ✅ Đã áp dụng middleware:

**Bookings** (`routes/bookings.js`):
- `GET /api/bookings` - Admin only
- `GET /api/bookings/:id` - Authenticated users
- `POST /api/bookings` - Authenticated users
- `PUT /api/bookings/:id/status` - Admin only

**Users** (`routes/users.js`):
- `GET /api/users/profile` - Authenticated users
- `PUT /api/users/profile` - Authenticated users
- `GET /api/users/addresses` - Authenticated users
- `POST /api/users/addresses` - Authenticated users
- `GET /api/users/bookings` - Authenticated users

**Admin Tours** (`routes/admin/tours.js`):
- Tất cả routes - Admin only

### ⚠️ Chưa áp dụng (cần thêm):

**Tours** (`routes/tours.js`):
- Hiện tại: Public (ai cũng xem được)
- Khuyến nghị: Giữ nguyên (public routes)

**Payments** (`routes/payments.js`):
- Cần thêm `authenticate` cho tất cả routes
- Một số routes cần `authorize(['admin'])`

---

## 🚀 Best Practices

1. **Luôn dùng `authenticate` trước `authorize`**
2. **Không hardcode userId** - lấy từ `req.user.userId`
3. **Kiểm tra ownership** cho resources của user
4. **Log authentication events** để audit
5. **Sử dụng HTTPS** trong production để bảo vệ token

---

## 🔄 Migration từ code cũ

### Trước đây:
```javascript
router.get('/profile', async (req, res) => {
  const userId = req.query.userId || 1; // ❌ Không an toàn
});
```

### Bây giờ:
```javascript
router.get('/profile', authenticate, async (req, res) => {
  const userId = req.user.userId; // ✅ Từ JWT token
});
```

---

## 📞 Support

Nếu có vấn đề với authentication/authorization:
1. Kiểm tra token có được gửi đúng format không
2. Kiểm tra `JWT_SECRET` trong `.env`
3. Kiểm tra user có role phù hợp trong database
4. Xem console logs để debug
