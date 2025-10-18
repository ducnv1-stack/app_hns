# HNS Booking Tour Backend

Backend API cho hệ thống đặt tour du lịch Hà Nội Sun.

## 🚀 Cài đặt và Chạy

### 1. Cài đặt dependencies
```bash
cd backend
npm install
```

### 2. Cấu hình môi trường
Tạo file `.env` từ `config.env` và cập nhật thông tin database:
```env
DB_USER=postgres
DB_PASS=1234
DB_HOST=localhost
DB_PORT=5432
DB_NAME=HNS_Booking_Tour
```

### 3. Chạy server
```bash
# Development mode
npm run dev

# Production mode
npm start

# Hoặc chạy với migration tự động
node start.js
```

## 📊 API Endpoints

### Tours
- `GET /api/tours` - Lấy danh sách tour (có filter, pagination)
- `GET /api/tours/:id` - Lấy chi tiết tour
- `GET /api/tours/meta/countries` - Lấy danh sách quốc gia
- `GET /api/tours/meta/categories` - Lấy danh sách loại tour

### Bookings
- `GET /api/bookings` - Lấy danh sách đơn đặt chỗ
- `GET /api/bookings/:id` - Lấy chi tiết đơn đặt chỗ
- `POST /api/bookings` - Tạo đơn đặt chỗ mới
- `PUT /api/bookings/:id/status` - Cập nhật trạng thái đơn đặt chỗ

### Users
- `GET /api/users/profile` - Lấy thông tin profile
- `PUT /api/users/profile` - Cập nhật profile
- `GET /api/users/addresses` - Lấy danh sách địa chỉ
- `POST /api/users/addresses` - Thêm địa chỉ mới
- `GET /api/users/bookings` - Lấy đơn đặt chỗ của user

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `POST /api/auth/logout` - Đăng xuất

## 🗄️ Database Schema

Hệ thống sử dụng PostgreSQL với các bảng chính:
- `services` - Dịch vụ (tour, hotel, flight)
- `service_variants` - Biến thể dịch vụ (giá khác nhau)
- `service_availabilities` - Lịch trình khả dụng
- `bookings` - Đơn đặt chỗ
- `booking_items` - Chi tiết từng mục trong đơn
- `parties` - Thông tin cá nhân/tổ chức
- `users` - Tài khoản người dùng

## 🔧 Scripts

### Migrate Data
```bash
# Migrate tours từ tours.js sang database
npm run migrate
```

### Development
```bash
# Chạy với nodemon (auto-restart)
npm run dev
```

## 📝 Cấu trúc thư mục

```
backend/
├── config/
│   └── database.js          # Cấu hình database
├── routes/
│   ├── tours.js            # API tours
│   ├── bookings.js         # API bookings
│   ├── users.js            # API users
│   └── auth.js             # API authentication
├── scripts/
│   └── migrateTours.js     # Script migrate data
├── server.js               # Express server
├── start.js                # Startup script
└── package.json
```

## 🔒 Security Features

- JWT Authentication
- Rate limiting
- CORS configuration
- Input validation
- SQL injection protection
- Helmet security headers

## 📊 Monitoring

- Health check endpoint: `GET /api/health`
- Query logging
- Error handling
- Request/response logging
