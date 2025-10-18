# 🔐 Authentication & Authorization - Quick Reference

## 📚 Mục lục
1. [Demo Accounts](#demo-accounts)
2. [API Endpoints](#api-endpoints)
3. [Middleware Usage](#middleware-usage)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)

---

## 🔑 Demo Accounts

### Admin Account
```
Email: admin@hanoisuntravel.com
Password: admin123
Roles: ['admin']
```

### User Account
```
Email: user@demo.com
Password: user123
Roles: ['user']
```

**Tạo demo accounts**:
```bash
cd backend
node scripts/createUserData.js
```

---

## 🌐 API Endpoints

### Public Endpoints (No authentication required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tours` | Get all tours |
| GET | `/api/tours/:id` | Get tour details |
| GET | `/api/tours/meta/countries` | Get countries list |
| GET | `/api/tours/meta/categories` | Get categories list |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/payments/vnpay/return` | VNPay callback |
| POST | `/api/payments/stripe/webhook` | Stripe webhook |

---

### Authenticated Endpoints (Login required)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/api/auth/me` | Any | Get current user info |
| GET | `/api/users/profile` | Any | Get user profile |
| PUT | `/api/users/profile` | Any | Update user profile |
| GET | `/api/users/addresses` | Any | Get user addresses |
| POST | `/api/users/addresses` | Any | Add new address |
| GET | `/api/users/bookings` | Any | Get user bookings |
| GET | `/api/bookings/:id` | Any | Get booking details |
| POST | `/api/bookings` | Any | Create new booking |
| POST | `/api/payments` | Any | Create payment |
| GET | `/api/payments/:id` | Any | Get payment status |
| GET | `/api/payments/booking/:id` | Any | Get payments by booking |

---

### Admin Only Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get all bookings |
| PUT | `/api/bookings/:id/status` | Update booking status |
| POST | `/api/payments/:id/refund` | Process refund |
| GET | `/api/payments/stats/overview` | Get payment statistics |
| GET | `/api/admin/tours` | Get all tours (admin view) |
| POST | `/api/admin/tours` | Create new tour |
| PUT | `/api/admin/tours/:id` | Update tour |
| DELETE | `/api/admin/tours/:id` | Delete tour (soft) |
| DELETE | `/api/admin/tours/:id/hard` | Delete tour (permanent) |
| GET | `/api/admin/tours/stats` | Get tour statistics |
| PATCH | `/api/admin/tours/bulk` | Bulk update tours |

---

## 🛠️ Middleware Usage

### Import Middleware
```javascript
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
```

### Examples

#### 1. Public Route (No authentication)
```javascript
router.get('/tours', async (req, res) => {
  // Anyone can access
  const tours = await Tour.findAll();
  res.json({ success: true, data: tours });
});
```

#### 2. Authenticated Route (Login required)
```javascript
router.get('/profile', authenticate, async (req, res) => {
  // Only logged-in users
  const userId = req.user.userId; // From JWT token
  const user = await User.findById(userId);
  res.json({ success: true, data: user });
});
```

#### 3. Admin Only Route
```javascript
router.post('/admin/tours', authenticate, authorize(['admin']), async (req, res) => {
  // Only admin users
  const tour = await Tour.create(req.body);
  res.json({ success: true, data: tour });
});
```

#### 4. Multiple Roles
```javascript
router.get('/bookings', authenticate, authorize(['user', 'admin']), async (req, res) => {
  // Both user and admin can access
  const bookings = await Booking.findAll();
  res.json({ success: true, data: bookings });
});
```

#### 5. Apply to All Routes in Router
```javascript
const router = express.Router();

// Apply to ALL routes below
router.use(authenticate);
router.use(authorize(['admin']));

// All these routes require admin
router.get('/', ...);
router.post('/', ...);
router.put('/:id', ...);
router.delete('/:id', ...);
```

#### 6. Optional Authentication
```javascript
router.get('/tours', optionalAuth, async (req, res) => {
  if (req.user) {
    // User is logged in - show special prices
    const tours = await Tour.findAllWithDiscount();
  } else {
    // User not logged in - show regular prices
    const tours = await Tour.findAll();
  }
  res.json({ success: true, data: tours });
});
```

---

## 🧪 Testing

### 1. Using curl

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hanoisuntravel.com","password":"admin123"}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@hanoisuntravel.com",
      "roles": ["admin"]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Use Token:**
```bash
# Replace <TOKEN> with actual token from login response
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer <TOKEN>"
```

---

### 2. Using Postman

**Step 1: Login**
- Method: POST
- URL: `http://localhost:5000/api/auth/login`
- Body (JSON):
  ```json
  {
    "email": "admin@hanoisuntravel.com",
    "password": "admin123"
  }
  ```
- Copy `token` from response

**Step 2: Use Token**
- Go to **Authorization** tab
- Type: **Bearer Token**
- Token: Paste the token
- Send request to protected endpoint

---

### 3. Using Test Script

```bash
cd backend
node scripts/testAuthentication.js
```

This will run 12 automated tests:
- ✅ Admin login
- ✅ User login
- ✅ Invalid credentials
- ✅ Access without token
- ✅ Access with valid token
- ✅ Access with invalid token
- ✅ User accessing admin route (denied)
- ✅ Admin accessing admin route (allowed)
- ✅ User accessing user route (allowed)
- ✅ Admin accessing user route (allowed)
- ✅ Admin /me endpoint
- ✅ User /me endpoint

---

## 🔍 req.user Structure

After `authenticate` middleware, `req.user` contains:

```javascript
{
  userId: 1,
  email: "admin@hanoisuntravel.com",
  roles: ["admin"]
}
```

**Usage in route handlers:**
```javascript
router.get('/profile', authenticate, async (req, res) => {
  const userId = req.user.userId;      // User ID
  const email = req.user.email;        // User email
  const roles = req.user.roles;        // User roles array
  
  // Check if user is admin
  const isAdmin = roles.includes('admin');
  
  // Your logic here...
});
```

---

## ⚠️ Common Errors

### 401 Unauthorized

**Error:**
```json
{
  "success": false,
  "error": "No token provided. Please login to access this resource."
}
```

**Solution:**
- Make sure you're sending `Authorization: Bearer <token>` header
- Check token is not expired (7 days validity)

---

### 403 Forbidden

**Error:**
```json
{
  "success": false,
  "error": "Access denied. You do not have permission to access this resource.",
  "requiredRoles": ["admin"],
  "yourRoles": ["user"]
}
```

**Solution:**
- You don't have required role
- Use admin account for admin routes
- Check user roles in database

---

### Token Expired

**Error:**
```json
{
  "success": false,
  "error": "Token expired. Please login again."
}
```

**Solution:**
- Login again to get new token
- Token expires after 7 days (configured in `JWT_EXPIRES_IN`)

---

### Invalid Token

**Error:**
```json
{
  "success": false,
  "error": "Invalid token. Please login again."
}
```

**Solution:**
- Token format is wrong
- Token has been tampered with
- JWT_SECRET mismatch
- Login again

---

## 🔧 Troubleshooting

### Check if user has correct roles

```sql
-- Connect to PostgreSQL
psql -U postgres -d HNS_Booking_Tour

-- Check user roles
SELECT 
  u.id,
  u.username,
  p.email,
  array_agg(r.role_name) as roles
FROM users u
JOIN parties p ON u.party_id = p.id
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE p.email = 'admin@hanoisuntravel.com'
GROUP BY u.id, u.username, p.email;
```

### Verify JWT token

```javascript
// In Node.js console or script
const jwt = require('jsonwebtoken');
const token = 'your_token_here';
const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log(decoded);
```

### Check middleware is applied

```javascript
// In route file, add logging
router.get('/test', authenticate, (req, res) => {
  console.log('User:', req.user); // Should show user info
  res.json({ user: req.user });
});
```

---

## 📝 Best Practices

### 1. Always use authenticate before authorize
```javascript
// ✅ CORRECT
router.post('/', authenticate, authorize(['admin']), handler);

// ❌ WRONG
router.post('/', authorize(['admin']), authenticate, handler);
```

### 2. Don't hardcode userId
```javascript
// ❌ WRONG
const userId = req.query.userId; // User can fake this

// ✅ CORRECT
const userId = req.user.userId; // From verified JWT token
```

### 3. Check ownership for user resources
```javascript
router.get('/bookings/:id', authenticate, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  
  // Check if user owns this booking OR is admin
  if (booking.user_id !== req.user.userId && !req.user.roles.includes('admin')) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.json({ data: booking });
});
```

### 4. Use HTTPS in production
```javascript
// In production, always use HTTPS to protect tokens
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### 5. Set secure cookie options
```javascript
// If using cookies for tokens
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```

---

## 🚀 Quick Start Checklist

- [ ] Backend server running on port 5000
- [ ] PostgreSQL database running
- [ ] Demo users created (`node scripts/createUserData.js`)
- [ ] Environment variables set (`.env` file)
- [ ] Test login with Postman/curl
- [ ] Verify token is returned
- [ ] Test protected route with token
- [ ] Test admin route with user token (should fail)
- [ ] Test admin route with admin token (should succeed)

---

## 📞 Support

**Environment Variables Required:**
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

**Database Connection:**
```env
DB_USER=postgres
DB_PASS=1234
DB_HOST=localhost
DB_PORT=5432
DB_NAME=HNS_Booking_Tour
```

**Check Logs:**
- Authentication success: `✅ Authentication successful`
- Authorization success: `✅ Authorization successful`
- Authentication failed: `❌ Authentication failed`
- Authorization failed: `❌ Authorization failed`

---

**Last Updated**: 2025-10-10  
**Version**: 1.0.0
