# 🚀 Hướng Dẫn Setup Dự Án HNS Booking Tour

Dự án này bao gồm **Backend** (Node.js/Express) và **Frontend** (React/Vite). Dưới đây là các bước cần thiết để chạy dự án.

## 📋 Yêu Cầu Hệ Thống

### 1. Cài Đặt Phần Mềm Cần Thiết

#### Node.js và npm
- **Node.js** phiên bản 16 trở lên
- Tải về: https://nodejs.org/
- Kiểm tra cài đặt:
  ```bash
  node --version
  npm --version
  ```

#### PostgreSQL Database
- **PostgreSQL** phiên bản 12 trở lên
- Tải về: https://www.postgresql.org/download/
- Hoặc sử dụng **Supabase** (cloud database) - đã có cấu hình sẵn

#### Git (Tùy chọn)
- Để clone repository nếu cần

---

## 🔧 Bước 1: Setup Backend

### 1.1. Cài đặt Dependencies

```bash
cd backend
npm install
```

### 1.2. Cấu hình Database

#### Option A: Sử dụng Supabase (Khuyến nghị - đã có sẵn)

File `backend/config.env` đã có cấu hình Supabase. Bạn chỉ cần:
- Kiểm tra file `backend/config.env` 
- Đảm bảo các thông tin Supabase đã được cấu hình đúng

#### Option B: Sử dụng PostgreSQL Local

1. Tạo database PostgreSQL:
   ```sql
   CREATE DATABASE hns_booking_tour;
   CREATE USER hns_user WITH PASSWORD '123456789';
   GRANT ALL PRIVILEGES ON DATABASE hns_booking_tour TO hns_user;
   ```

2. Cập nhật file `backend/config.env`:
   ```env
   DB_USER=hns_user
   DB_PASS=123456789
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=hns_booking_tour
   ```

### 1.3. Cấu hình Environment Variables

File `backend/config.env` cần có các biến sau:

```env
# Database Configuration
DB_USER=hns_user
DB_PASS=123456789
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hns_booking_tour

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration (cho development)
FRONTEND_URL=http://localhost:5173

# Payment Configuration (Tùy chọn)
VNP_TMN_CODE=DEMO
VNP_HASH_SECRET=DEMOSECRET
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

### 1.4. Chạy Backend Server

```bash
# Development mode (tự động restart khi có thay đổi)
npm run dev

# Hoặc Production mode
npm start
```

Backend sẽ chạy tại: **http://localhost:5000**

Kiểm tra API: http://localhost:5000/api/health

---

## 🎨 Bước 2: Setup Frontend

### 2.1. Cài đặt Dependencies

```bash
cd HaNoiSun-main
npm install
```

### 2.2. Cấu hình API Endpoint

Frontend đã được cấu hình để kết nối với backend tại:
- Development: `http://localhost:5000/api` (qua proxy hoặc CORS)
- Production: `https://api.hanoisuntravel.com/api`

Nếu backend chạy ở port khác, cần cập nhật:
- File `HaNoiSun-main/vite.config.js` - thêm proxy configuration
- Hoặc file `HaNoiSun-main/src/config/env.js` - cập nhật API_BASE_URL

### 2.3. Chạy Frontend Development Server

```bash
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

---

## ✅ Bước 3: Kiểm Tra Kết Nối

### 3.1. Kiểm tra Backend
- Mở trình duyệt: http://localhost:5000/api/health
- Kết quả mong đợi: `{"status":"OK",...}`

### 3.2. Kiểm tra Frontend
- Mở trình duyệt: http://localhost:5173
- Trang web sẽ hiển thị và có thể kết nối với backend

### 3.3. Kiểm tra Database Connection
```bash
cd backend
node check-db-connection.js
```

---

## 📦 Cấu Trúc Dự Án

```
app_hns/
├── backend/                 # Backend API (Node.js/Express)
│   ├── config/             # Database configuration
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   ├── server.js           # Main server file
│   ├── config.env          # Environment variables
│   └── package.json
│
└── HaNoiSun-main/          # Frontend (React/Vite)
    ├── src/                # Source code
    ├── public/             # Static files
    ├── vite.config.js      # Vite configuration
    └── package.json
```

---

## 🔍 Troubleshooting (Xử Lý Lỗi)

### Lỗi: Cannot connect to database
- Kiểm tra PostgreSQL đã chạy chưa
- Kiểm tra thông tin trong `backend/config.env`
- Kiểm tra firewall/port 5432

### Lỗi: Port already in use
- Backend: Đổi PORT trong `config.env` (mặc định 5000)
- Frontend: Đổi port trong `vite.config.js` (mặc định 5173)

### Lỗi: CORS error
- Kiểm tra `FRONTEND_URL` trong `backend/config.env`
- Đảm bảo frontend URL được thêm vào `allowedOrigins` trong `server.js`

### Lỗi: Module not found
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: Database migration
```bash
cd backend
npm run migrate
```

---

## 🚀 Scripts Hữu Ích

### Backend
```bash
npm start          # Chạy production server
npm run dev        # Chạy development server (nodemon)
npm run migrate    # Migrate data
npm run test:auth  # Test authentication
```

### Frontend
```bash
npm run dev        # Chạy development server
npm run build      # Build production
npm run preview    # Preview production build
npm run lint       # Kiểm tra code style
```

---

## 📝 Lưu Ý Quan Trọng

1. **Database**: Đảm bảo database đã được tạo và có quyền truy cập
2. **Ports**: 
   - Backend: 5000
   - Frontend: 5173
   - PostgreSQL: 5432
3. **Environment Variables**: Không commit file `.env` hoặc `config.env` có thông tin nhạy cảm
4. **JWT Secret**: Thay đổi `JWT_SECRET` trong production
5. **CORS**: Cấu hình đúng `FRONTEND_URL` để tránh lỗi CORS

---

## 🎯 Quick Start (Tóm Tắt Nhanh)

```bash
# 1. Setup Backend
cd backend
npm install
# Cấu hình config.env với thông tin database
npm run dev

# 2. Setup Frontend (terminal mới)
cd HaNoiSun-main
npm install
npm run dev

# 3. Mở trình duyệt
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000/api
```

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề, kiểm tra:
- Logs trong `backend/logs/`
- Console của trình duyệt (F12)
- Terminal output của backend và frontend


