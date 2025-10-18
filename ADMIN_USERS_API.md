# Admin Users API Documentation

## Tổng quan

API quản lý users trong Admin Dashboard, lấy thông tin từ 4 bảng:
- **users** - Thông tin đăng nhập
- **parties** - Thông tin cá nhân (email, phone, tên)
- **user_roles** - Liên kết user với role
- **roles** - Danh sách roles (admin, user, provider)

## Endpoints

### 1. GET `/api/admin/users`
Lấy danh sách tất cả users với filters, pagination và thống kê bookings.

#### Headers
```
Authorization: Bearer <admin_token>
```

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Số trang |
| limit | integer | 20 | Số items mỗi trang |
| search | string | '' | Tìm kiếm theo tên, email, username |
| role | string | '' | Filter theo role (USER, ADMIN, PROVIDER) |
| status | string | '' | Filter theo status (active, inactive, all) |

#### Response
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "1",
        "party_id": "1",
        "username": "admin@hanoisuntravel.com",
        "auth_provider": "local",
        "is_active": true,
        "last_login": "2025-10-11T02:32:42.793Z",
        "created_at": "2025-10-09T08:29:39.625Z",
        "updated_at": "2025-10-11T02:32:42.793Z",
        "full_name": "Admin User",
        "email": "admin@hanoisuntravel.com",
        "phone_number": "0123456789",
        "party_type": "PERSON",
        "is_email_verified": true,
        "is_phone_verified": false,
        "metadata": {},
        "role_name": "admin",
        "booking_count": "0",
        "total_spent": "0"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 2,
      "itemsPerPage": 20,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

#### SQL Query
```sql
SELECT 
  u.id,
  u.party_id,
  u.username,
  u.auth_provider,
  u.is_active,
  u.last_login,
  u.created_at,
  u.updated_at,
  p.full_name,
  p.email,
  p.phone_number,
  p.party_type,
  p.is_email_verified,
  p.is_phone_verified,
  p.metadata,
  r.role_name,
  COUNT(DISTINCT b.id) as booking_count,
  COALESCE(SUM(b.total_amount), 0) as total_spent
FROM users u
LEFT JOIN parties p ON u.party_id = p.id
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
LEFT JOIN bookings b ON p.id = b.buyer_party_id
WHERE 1=1
GROUP BY u.id, p.id, r.role_name
ORDER BY u.created_at DESC
LIMIT 20 OFFSET 0
```

---

### 2. GET `/api/admin/users/:id`
Lấy thông tin chi tiết của 1 user, bao gồm 10 bookings gần nhất.

#### Headers
```
Authorization: Bearer <admin_token>
```

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | User ID |

#### Response
```json
{
  "success": true,
  "data": {
    "id": "1",
    "party_id": "1",
    "username": "admin@hanoisuntravel.com",
    "auth_provider": "local",
    "is_active": true,
    "last_login": "2025-10-11T02:32:42.793Z",
    "created_at": "2025-10-09T08:29:39.625Z",
    "updated_at": "2025-10-11T02:32:42.793Z",
    "full_name": "Admin User",
    "email": "admin@hanoisuntravel.com",
    "phone_number": "0123456789",
    "party_type": "PERSON",
    "is_email_verified": true,
    "is_phone_verified": false,
    "metadata": {},
    "role_name": "admin",
    "role_id": "1",
    "recent_bookings": [
      {
        "id": "123",
        "booking_code": "BK001",
        "status": "confirmed",
        "total_amount": "2500000",
        "created_at": "2025-10-10T10:00:00Z",
        "service_name": "Tour Hạ Long 2N1Đ"
      }
    ]
  }
}
```

---

### 3. PUT `/api/admin/users/:id/status`
Kích hoạt hoặc vô hiệu hóa user.

#### Headers
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | User ID |

#### Request Body
```json
{
  "is_active": true
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "2",
    "is_active": true,
    "updated_at": "2025-10-12T14:30:00Z"
  },
  "message": "User activated successfully"
}
```

---

### 4. PUT `/api/admin/users/:id/role`
Thay đổi role của user.

#### Headers
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | User ID |

#### Request Body
```json
{
  "role_name": "ADMIN"
}
```

**Valid role_name values**: `USER`, `ADMIN`, `PROVIDER`

#### Response
```json
{
  "success": true,
  "message": "User role updated successfully"
}
```

#### Process
1. Tìm role_id từ role_name
2. Xóa role cũ trong `user_roles`
3. Insert role mới vào `user_roles`
4. Transaction để đảm bảo data consistency

---

### 5. GET `/api/admin/users/stats/overview`
Lấy thống kê tổng quan về users.

#### Headers
```
Authorization: Bearer <admin_token>
```

#### Response
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_users": "2",
      "active_users": "2",
      "inactive_users": "0",
      "new_users_30d": "2",
      "verified_users": "2"
    },
    "by_role": [
      {
        "role_name": "admin",
        "user_count": "1"
      },
      {
        "role_name": "user",
        "user_count": "1"
      },
      {
        "role_name": "provider",
        "user_count": "0"
      }
    ]
  }
}
```

---

## Database Schema

### Bảng users
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  party_id BIGINT NOT NULL REFERENCES parties(id),
  username VARCHAR(255),
  password_hash VARCHAR(255),
  auth_provider VARCHAR(50) DEFAULT 'local',
  provider_user_id VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Bảng parties
```sql
CREATE TABLE parties (
  id BIGSERIAL PRIMARY KEY,
  party_type party_type_enum NOT NULL,
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone_number VARCHAR(20),
  is_email_verified BOOLEAN DEFAULT false,
  is_phone_verified BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Bảng roles
```sql
CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Bảng user_roles
```sql
CREATE TABLE user_roles (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);
```

---

## Quan hệ giữa các bảng

```
users (1) -----> (1) parties
  |                    |
  | (1)                | (1)
  |                    |
  v (N)                v (N)
user_roles         bookings
  |
  | (N)
  |
  v (1)
roles
```

### Giải thích
- 1 **user** có 1 **party** (thông tin cá nhân)
- 1 **user** có nhiều **user_roles** (thường là 1)
- 1 **role** có nhiều **user_roles**
- 1 **party** có nhiều **bookings** (qua buyer_party_id)

---

## Ví dụ sử dụng

### Lấy danh sách users với filter
```bash
GET /api/admin/users?page=1&limit=10&role=USER&status=active&search=john
```

### Lấy chi tiết user
```bash
GET /api/admin/users/1
```

### Vô hiệu hóa user
```bash
PUT /api/admin/users/2/status
Content-Type: application/json

{
  "is_active": false
}
```

### Thay đổi role thành admin
```bash
PUT /api/admin/users/2/role
Content-Type: application/json

{
  "role_name": "ADMIN"
}
```

### Lấy thống kê
```bash
GET /api/admin/users/stats/overview
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "is_active must be a boolean"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Invalid token. Please login again."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Access denied. Admin role required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to fetch users"
}
```

---

## Testing

Script test đã được tạo tại: `backend/scripts/testAdminUsersAPI.js`

```bash
cd backend
node scripts/testAdminUsersAPI.js
```

Kết quả:
- ✅ List users query
- ✅ Get user by ID query
- ✅ Statistics query
- ✅ Role distribution query

---

## Notes

1. **Authentication**: Tất cả endpoints yêu cầu admin token
2. **Pagination**: Default limit = 20, max không giới hạn
3. **Search**: Tìm kiếm trong full_name, email, username (case-insensitive)
4. **Bookings**: Join qua `parties.id = bookings.buyer_party_id`
5. **Transaction**: Update role sử dụng transaction để đảm bảo consistency
6. **Metadata**: Field `metadata` trong parties là JSONB, có thể chứa thông tin bổ sung

---

## Frontend Integration

Frontend component `UserManagement.jsx` đã được tạo và sử dụng API này qua `adminUserService.js`.

Xem chi tiết tại: `app_hns/HaNoiSun-main/src/pages/admin/UserManagement.jsx`
