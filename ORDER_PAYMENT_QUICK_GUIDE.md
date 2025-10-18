# Hướng dẫn Nhanh: Lấy Thông tin Order & Payment

## ✅ Kết luận: HỆ THỐNG ĐÃ CÓ ĐẦY ĐỦ

Tất cả thông tin yêu cầu đã có sẵn trong hệ thống.

---

## 🚀 API MỚI: Get Complete Order Info

### Endpoint
```
GET /api/bookings/:id/complete
```

**Mô tả**: Lấy TẤT CẢ thông tin order trong 1 request duy nhất:
- Thông tin order
- Thông tin buyer
- **Danh sách products (có phân loại TOUR/FLIGHT/HOTEL/COMBO)**
- Danh sách payments
- **Tổng hợp payment (đủ/thiếu)**

### Request
```bash
GET /api/bookings/123/complete
Authorization: Bearer <token>
```

### Response
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "123",
      "booking_code": "HST12345678",
      "total_amount": "5000000",
      "currency": "VND",
      "status": "PENDING",
      "created_at": "2025-10-13T...",
      "buyer": {
        "name": "Nguyen Van A",
        "email": "customer@example.com",
        "phone": "0123456789"
      },
      "items": [
        {
          "id": "1",
          "service_id": "12",
          "service_name": "Tour Hạ Long 2N1Đ",
          "service_type": "TOUR",           // ← PHÂN LOẠI
          "variant_id": "5",
          "variant_name": "Vé người lớn",
          "quantity": 2,
          "unit_price": "2500000",
          "total_price": "5000000",
          "availability": {
            "start": "2025-11-01T08:00:00Z",
            "end": "2025-11-03T18:00:00Z"
          }
        },
        {
          "service_type": "FLIGHT",         // ← PHÂN LOẠI
          "service_name": "Vé máy bay HAN-SGN",
          ...
        }
      ]
    },
    "payments": [
      {
        "id": "456",
        "payment_method": "bank_transfer",
        "transaction_id": "VNP123456",
        "amount": "3000000",
        "status": "SUCCESS",
        "paid_at": "2025-10-13T10:00:00Z"
      },
      {
        "id": "457",
        "amount": "1000000",
        "status": "PENDING"
      }
    ],
    "payment_summary": {
      "total_amount": 5000000,
      "paid_amount": 3000000,
      "remaining_amount": 2000000,
      "payment_status": "PAID_PARTIAL",    // ← ĐỦ/THIẾU
      "payment_percentage": "60.00",
      "successful_payments_count": 1,
      "total_payments_count": 2
    }
  }
}
```

---

## 📋 Thông tin Trả về

### ✅ Thông tin Order
- `order.id` - Order ID
- `order.booking_code` - Mã đặt chỗ
- `order.total_amount` - Tổng tiền
- `order.status` - Trạng thái order
- `order.buyer` - Thông tin người mua

### ✅ Thông tin Products (có phân loại)
- `items[].service_id` - Product ID
- `items[].service_name` - Tên sản phẩm
- **`items[].service_type`** - **Phân loại: TOUR / FLIGHT / HOTEL / COMBO**
- `items[].variant_id` - Product Variant ID
- `items[].variant_name` - Tên variant
- `items[].quantity` - Số lượng
- `items[].unit_price` - Đơn giá
- `items[].total_price` - Thành tiền

### ✅ Thông tin Payments
- `payments[].id` - Payment ID
- `payments[].amount` - Số tiền thanh toán
- `payments[].status` - Trạng thái (SUCCESS/PENDING/FAILED)
- `payments[].payment_method` - Phương thức thanh toán
- `payments[].transaction_id` - Mã giao dịch

### ✅ Payment Summary (Đủ/Thiếu)
- `payment_summary.total_amount` - Tổng tiền cần thanh toán
- `payment_summary.paid_amount` - Đã thanh toán
- `payment_summary.remaining_amount` - Còn thiếu
- **`payment_summary.payment_status`** - **PAID_FULL / PAID_PARTIAL**
- `payment_summary.payment_percentage` - % đã thanh toán

---

## 💻 Frontend Usage

### React Example

```javascript
import { api } from './services/api';

const OrderDetails = ({ orderId }) => {
  const [orderData, setOrderData] = useState(null);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/bookings/${orderId}/complete`);
        setOrderData(response.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      }
    };
    
    fetchOrder();
  }, [orderId]);
  
  if (!orderData) return <div>Loading...</div>;
  
  const { order, payments, payment_summary } = orderData;
  
  return (
    <div>
      <h2>Order #{order.booking_code}</h2>
      
      {/* Order Info */}
      <div>
        <p>Total: {order.total_amount} {order.currency}</p>
        <p>Status: {order.status}</p>
      </div>
      
      {/* Products with Classification */}
      <h3>Products</h3>
      {order.items.map(item => (
        <div key={item.id}>
          <span className={`badge ${item.service_type.toLowerCase()}`}>
            {item.service_type}
          </span>
          <p>{item.service_name}</p>
          <p>Variant: {item.variant_name}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Price: {item.total_price}</p>
        </div>
      ))}
      
      {/* Payment Summary */}
      <h3>Payment Status</h3>
      <div className={payment_summary.payment_status === 'PAID_FULL' ? 'paid-full' : 'paid-partial'}>
        <p>Total: {payment_summary.total_amount}</p>
        <p>Paid: {payment_summary.paid_amount}</p>
        <p>Remaining: {payment_summary.remaining_amount}</p>
        <p>Status: {payment_summary.payment_status}</p>
        <div className="progress-bar">
          <div style={{ width: `${payment_summary.payment_percentage}%` }} />
        </div>
      </div>
      
      {/* Payments List */}
      <h3>Payments</h3>
      {payments.map(payment => (
        <div key={payment.id}>
          <p>Amount: {payment.amount}</p>
          <p>Status: {payment.status}</p>
          <p>Method: {payment.payment_method}</p>
          {payment.transaction_id && <p>Transaction: {payment.transaction_id}</p>}
        </div>
      ))}
    </div>
  );
};
```

---

## 🎨 UI Display Examples

### Product Type Badges
```jsx
const getServiceTypeBadge = (type) => {
  const badges = {
    TOUR: { label: 'Tour du lịch', color: 'blue' },
    FLIGHT: { label: 'Vé máy bay', color: 'green' },
    HOTEL: { label: 'Khách sạn', color: 'purple' },
    COMBO: { label: 'Combo', color: 'orange' }
  };
  
  const badge = badges[type] || { label: type, color: 'gray' };
  
  return (
    <span className={`badge badge-${badge.color}`}>
      {badge.label}
    </span>
  );
};
```

### Payment Status Display
```jsx
const PaymentStatusBadge = ({ status, percentage }) => {
  if (status === 'PAID_FULL') {
    return <span className="badge badge-success">✓ Đã thanh toán đủ</span>;
  }
  
  return (
    <div className="payment-partial">
      <span className="badge badge-warning">⚠ Thanh toán thiếu</span>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${percentage}%` }}>
          {percentage}%
        </div>
      </div>
    </div>
  );
};
```

---

## 📊 Service Type Classification

### Các loại service_type:

| Type | Label | Mô tả |
|------|-------|-------|
| `TOUR` | Tour du lịch | Tour trọn gói, có lịch trình |
| `FLIGHT` | Vé máy bay | Vé máy bay riêng lẻ |
| `HOTEL` | Khách sạn | Đặt phòng khách sạn |
| `COMBO` | Combo | Gói kết hợp nhiều dịch vụ |

### Filter by Service Type
```javascript
// Lọc chỉ tour
const tours = order.items.filter(item => item.service_type === 'TOUR');

// Lọc chỉ vé máy bay
const flights = order.items.filter(item => item.service_type === 'FLIGHT');

// Đếm số lượng theo loại
const countByType = order.items.reduce((acc, item) => {
  acc[item.service_type] = (acc[item.service_type] || 0) + 1;
  return acc;
}, {});
// Result: { TOUR: 2, FLIGHT: 1, HOTEL: 1 }
```

---

## 🔧 Other Available APIs

Nếu không muốn dùng `/complete`, có thể gọi riêng lẻ:

### 1. Get Order Only
```bash
GET /api/bookings/:id
```

### 2. Get Payments Only
```bash
GET /api/payments/booking/:bookingId
```

### 3. Get All Orders (Admin)
```bash
GET /api/bookings?status=PENDING&page=1&limit=10
```

---

## ✅ Checklist Thông tin

### Order Information
- ✅ Order ID
- ✅ Booking Code
- ✅ Total Amount
- ✅ Currency
- ✅ Status
- ✅ Buyer Info

### Product Information
- ✅ Product ID (service_id)
- ✅ Product Name
- ✅ **Product Type (TOUR/FLIGHT/HOTEL/COMBO)**
- ✅ Variant ID
- ✅ Variant Name
- ✅ Quantity
- ✅ Unit Price
- ✅ Total Price

### Payment Information
- ✅ Payment ID
- ✅ Payment Amount
- ✅ Payment Status
- ✅ Payment Method
- ✅ Transaction ID
- ✅ **Payment Summary (PAID_FULL/PAID_PARTIAL)**

---

## 🎯 Summary

**1 API call duy nhất** để lấy TẤT CẢ thông tin:
```
GET /api/bookings/:id/complete
```

Trả về:
- ✅ Order details
- ✅ Products với phân loại (TOUR/FLIGHT/HOTEL/COMBO)
- ✅ Payments list
- ✅ Payment summary (đủ/thiếu)

**Không cần làm gì thêm** - Tất cả đã có sẵn! 🎉
