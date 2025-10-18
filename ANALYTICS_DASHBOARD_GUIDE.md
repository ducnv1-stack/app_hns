# Hướng dẫn Giao diện Báo cáo & Thống kê Admin

## ✅ Đã hoàn thành

Đã tạo giao diện báo cáo và thống kê đầy đủ cho admin dashboard với các tính năng:

---

## 🎯 Tính năng

### 1. **Tổng quan (Overview)**
- ✅ Tổng số sản phẩm (active/inactive)
- ✅ Tổng số đơn hàng
- ✅ Tổng doanh thu
- ✅ Tổng thanh toán thành công
- ✅ Tổng tiền chưa thanh toán
- ✅ Số đơn hàng chưa thanh toán

### 2. **Phân tích theo Product**
- ✅ Số lượng theo loại (Tour/Flight/Hotel/Combo)
- ✅ Top sản phẩm bán chạy
- ✅ Số lượng đơn hàng mỗi sản phẩm
- ✅ Doanh thu từng sản phẩm
- ✅ Số lượng bán được

### 3. **Phân tích theo Order**
- ✅ Tổng số đơn hàng
- ✅ Đơn hàng theo trạng thái (Pending/Confirmed/Paid/Cancelled/Completed)
- ✅ Số lượng đơn hàng chưa thanh toán
- ✅ Số lượng đơn hàng đã thanh toán
- ✅ Giá trị trung bình đơn hàng

### 4. **Phân tích theo Payment**
- ✅ Tổng số giao dịch thanh toán
- ✅ Thanh toán thành công/pending/failed
- ✅ Tổng tiền đã thanh toán
- ✅ Tổng tiền chưa thanh toán
- ✅ Phân tích theo phương thức thanh toán

### 5. **Bộ lọc**
- ✅ Filter theo khoảng thời gian (startDate - endDate)
- ✅ Xóa bộ lọc để xem tất cả

---

## 🚀 API Endpoints

### **GET `/api/admin/analytics/overview`**
Lấy tổng quan thống kê

**Query Parameters**:
- `startDate` (optional): Ngày bắt đầu (YYYY-MM-DD)
- `endDate` (optional): Ngày kết thúc (YYYY-MM-DD)

**Response**:
```json
{
  "success": true,
  "data": {
    "products": {
      "total_products": "45",
      "active_products": "42",
      "tour_count": "20",
      "flight_count": "10",
      "hotel_count": "8",
      "combo_count": "7"
    },
    "orders": {
      "total_orders": "1247",
      "pending_orders": "23",
      "confirmed_orders": "150",
      "paid_orders": "980",
      "cancelled_orders": "50",
      "completed_orders": "44",
      "total_order_value": "245000000",
      "average_order_value": "196474.58"
    },
    "payments": {
      "total_payments": "1100",
      "successful_payments": "980",
      "pending_payments": "100",
      "failed_payments": "20",
      "total_paid_amount": "230000000",
      "pending_payment_amount": "15000000"
    },
    "unpaid": {
      "unpaid_orders_count": "267",
      "unpaid_amount": "30000000"
    }
  }
}
```

---

### **GET `/api/admin/analytics/products`**
Lấy thống kê sản phẩm chi tiết

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "12",
      "name": "Tour Hạ Long 2N1Đ",
      "service_type": "TOUR",
      "status": "ACTIVE",
      "order_count": "45",
      "total_quantity_sold": "120",
      "total_revenue": "112500000"
    },
    ...
  ]
}
```

---

### **GET `/api/admin/analytics/orders-by-status`**
Lấy thống kê đơn hàng theo trạng thái

**Query Parameters**:
- `startDate` (optional)
- `endDate` (optional)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "status": "PAID",
      "count": "980",
      "total_amount": "230000000"
    },
    {
      "status": "PENDING",
      "count": "23",
      "total_amount": "5000000"
    },
    ...
  ]
}
```

---

### **GET `/api/admin/analytics/revenue-by-period`**
Lấy doanh thu theo thời gian

**Query Parameters**:
- `period`: `hour` | `day` | `week` | `month` (default: `day`)
- `startDate` (optional)
- `endDate` (optional)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "period": "2025-10-13",
      "order_count": "45",
      "total_revenue": "12500000"
    },
    ...
  ]
}
```

---

### **GET `/api/admin/analytics/payment-methods`**
Lấy thống kê theo phương thức thanh toán

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "payment_method": "bank_transfer",
      "count": "500",
      "successful_amount": "120000000",
      "pending_amount": "5000000",
      "failed_amount": "1000000"
    },
    {
      "payment_method": "credit_card",
      "count": "400",
      "successful_amount": "95000000",
      "pending_amount": "3000000",
      "failed_amount": "800000"
    },
    ...
  ]
}
```

---

## 💻 Frontend Component

### **Location**: `src/pages/admin/Analytics.jsx`

### **Features**:
1. **Overview Cards** - 4 thẻ tổng quan chính
2. **Product Type Breakdown** - Phân loại sản phẩm
3. **Orders by Status** - Đơn hàng theo trạng thái
4. **Payment Summary** - Tổng quan thanh toán
5. **Payment Methods** - Phương thức thanh toán
6. **Top Products Table** - Bảng top sản phẩm bán chạy
7. **Date Range Filter** - Bộ lọc theo thời gian

### **Usage**:
```jsx
import Analytics from './pages/admin/Analytics';

// In your router
<Route path="/admin/analytics" element={
  <ProtectedRoute roles={["admin"]}>
    <Analytics />
  </ProtectedRoute>
} />
```

---

## 🎨 UI Components

### 1. **Stats Cards**
```jsx
<div className="bg-white rounded-lg shadow p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-600">Tổng sản phẩm</p>
      <p className="text-3xl font-bold text-gray-900">45</p>
      <p className="text-sm text-green-600">42 đang hoạt động</p>
    </div>
    <div className="p-3 bg-blue-100 rounded-full">
      <Package className="h-8 w-8 text-blue-600" />
    </div>
  </div>
</div>
```

### 2. **Product Type Cards**
```jsx
<div className="p-4 bg-blue-50 rounded-lg">
  <p className="text-sm text-gray-600">Tour du lịch</p>
  <p className="text-2xl font-bold text-blue-600">20</p>
</div>
```

### 3. **Order Status Cards**
```jsx
<div className="p-4 bg-green-50 rounded-lg">
  <div className="flex items-center gap-2 mb-2">
    <CheckCircle className="h-4 w-4 text-green-600" />
    <p className="text-sm text-gray-600">Đã thanh toán</p>
  </div>
  <p className="text-2xl font-bold text-green-600">980</p>
  <p className="text-xs text-gray-500">230,000,000 VND</p>
</div>
```

### 4. **Top Products Table**
```jsx
<table className="min-w-full divide-y divide-gray-200">
  <thead>
    <tr>
      <th>Sản phẩm</th>
      <th>Loại</th>
      <th>Đơn hàng</th>
      <th>Số lượng</th>
      <th>Doanh thu</th>
    </tr>
  </thead>
  <tbody>
    {products.map(product => (
      <tr key={product.id}>
        <td>{product.name}</td>
        <td>
          <span className="badge">{product.service_type}</span>
        </td>
        <td>{product.order_count}</td>
        <td>{product.total_quantity_sold}</td>
        <td>{formatCurrency(product.total_revenue)}</td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## 🔗 Navigation

### **Admin Dashboard Links**:
```jsx
<Link to="/admin/reports" className="flex items-center p-3 rounded-lg hover:bg-gray-50">
  <BarChart3 className="h-5 w-5 text-gray-400 mr-3" />
  <span className="text-sm font-medium text-gray-700">Báo cáo & Thống kê</span>
</Link>
```

### **Routes**:
- `/admin/analytics` - Trang báo cáo chính
- `/admin/reports` - Alias cho analytics

---

## 📊 Data Display

### **Format Currency**:
```javascript
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};
```

### **Format Number**:
```javascript
const formatNumber = (num) => {
  return new Intl.NumberFormat('vi-VN').format(num);
};
```

---

## 🎯 Thông tin Hiển thị

### **Overview Section**:
- ✅ Tổng sản phẩm (với số active)
- ✅ Tổng đơn hàng (với tổng giá trị)
- ✅ Tổng thanh toán (với số giao dịch thành công)
- ✅ Chưa thanh toán (với số đơn hàng)

### **Product Analysis**:
- ✅ Số lượng Tour
- ✅ Số lượng Vé máy bay
- ✅ Số lượng Khách sạn
- ✅ Số lượng Combo

### **Order Analysis**:
- ✅ Chờ xử lý (PENDING)
- ✅ Đã xác nhận (CONFIRMED)
- ✅ Đã thanh toán (PAID)
- ✅ Đã hủy (CANCELLED)
- ✅ Hoàn thành (COMPLETED)

### **Payment Analysis**:
- ✅ Đã thanh toán (SUCCESS) - số lượng + số tiền
- ✅ Đang chờ (PENDING) - số lượng + số tiền
- ✅ Thất bại (FAILED) - số lượng
- ✅ Phương thức thanh toán - breakdown theo method

### **Top Products**:
- ✅ Tên sản phẩm
- ✅ Loại sản phẩm (badge màu)
- ✅ Số đơn hàng
- ✅ Tổng số lượng bán
- ✅ Tổng doanh thu

---

## 🔧 Backend Files

### **Created**:
- `backend/routes/admin/analytics.js` - API routes
- `backend/server.js` - Updated with analytics route

### **Frontend Files**:
- `src/pages/admin/Analytics.jsx` - Main component
- `src/services/adminAnalyticsService.js` - API service
- `src/App.jsx` - Updated with routes

---

## ✅ Checklist Hoàn thành

### Backend
- ✅ API endpoint `/api/admin/analytics/overview`
- ✅ API endpoint `/api/admin/analytics/products`
- ✅ API endpoint `/api/admin/analytics/orders-by-status`
- ✅ API endpoint `/api/admin/analytics/revenue-by-period`
- ✅ API endpoint `/api/admin/analytics/payment-methods`
- ✅ Authentication & Authorization (admin only)
- ✅ Date range filtering

### Frontend
- ✅ Analytics dashboard component
- ✅ Overview stats cards
- ✅ Product type breakdown
- ✅ Orders by status visualization
- ✅ Payment summary
- ✅ Payment methods breakdown
- ✅ Top products table
- ✅ Date range filter
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling

### Features
- ✅ Số phân tích theo product (TOUR/FLIGHT/HOTEL/COMBO)
- ✅ Số phân tích theo order (theo status)
- ✅ Số phân tích theo payment (thành công/pending/failed)
- ✅ Số lượt order (chưa/đã thanh toán)
- ✅ Tổng payment
- ✅ Tổng tiền chưa payment
- ✅ Filter theo thời gian

---

## 🚀 Cách sử dụng

### 1. **Truy cập trang Analytics**:
```
http://localhost:5173/#/admin/analytics
hoặc
http://localhost:5173/#/admin/reports
```

### 2. **Filter theo thời gian**:
- Chọn ngày bắt đầu
- Chọn ngày kết thúc
- Dữ liệu sẽ tự động cập nhật

### 3. **Xem thống kê**:
- Overview cards ở trên cùng
- Product breakdown theo loại
- Orders breakdown theo status
- Payment summary và methods
- Top products table

---

## 🎨 Color Scheme

### Product Types:
- **TOUR**: Blue (`bg-blue-50`, `text-blue-600`)
- **FLIGHT**: Green (`bg-green-50`, `text-green-600`)
- **HOTEL**: Purple (`bg-purple-50`, `text-purple-600`)
- **COMBO**: Orange (`bg-orange-50`, `text-orange-600`)

### Order Status:
- **PENDING**: Yellow (`bg-yellow-50`, `text-yellow-600`)
- **CONFIRMED**: Blue (`bg-blue-50`, `text-blue-600`)
- **PAID**: Green (`bg-green-50`, `text-green-600`)
- **CANCELLED**: Red (`bg-red-50`, `text-red-600`)
- **COMPLETED**: Purple (`bg-purple-50`, `text-purple-600`)

### Payment Status:
- **SUCCESS**: Green
- **PENDING**: Yellow
- **FAILED**: Red

---

## 📝 Notes

1. **Performance**: Queries được optimize với indexes trên các cột thường xuyên filter
2. **Security**: Tất cả endpoints yêu cầu admin authentication
3. **Scalability**: Có thể thêm các metrics khác dễ dàng
4. **Responsive**: UI responsive cho mobile, tablet, desktop
5. **Real-time**: Data có thể refresh bằng cách thay đổi date filter

---

## 🎯 Kết luận

Đã hoàn thành đầy đủ giao diện báo cáo và thống kê với:
- ✅ Phân tích theo product (có phân loại)
- ✅ Phân tích theo order (theo status)
- ✅ Phân tích theo payment (đủ/thiếu)
- ✅ Số lượt order
- ✅ Tổng payment
- ✅ Tổng tiền chưa payment
- ✅ Filter theo thời gian
- ✅ UI đẹp, responsive, dễ sử dụng

**Truy cập**: `/admin/analytics` hoặc `/admin/reports` 🎉
