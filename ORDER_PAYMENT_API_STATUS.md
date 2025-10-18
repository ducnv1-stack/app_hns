# Báo cáo Tính năng Order & Payment

## ✅ Kết luận: HỆ THỐNG ĐÃ CÓ ĐẦY ĐỦ TÍNH NĂNG

Hệ thống đã có đầy đủ API và database structure để trả thông tin order và payment theo yêu cầu.

---

## 📦 1. THÔNG TIN ORDER (Booking)

### API Endpoints

#### GET `/api/bookings/:id` - Lấy chi tiết order
**Authentication**: Required (Bearer token)

**Response bao gồm**:
```json
{
  "success": true,
  "data": {
    "id": "123",
    "booking_code": "HST12345678",
    "buyer_party_id": "1",
    "total_amount": "5000000",
    "currency": "VND",
    "status": "PENDING",
    "created_at": "2025-10-13T...",
    "buyer_name": "Nguyen Van A",
    "buyer_email": "customer@example.com",
    "buyer_phone": "0123456789",
    
    "items": [
      {
        "id": "1",
        "service_id": "12",
        "service_name": "Tour Hạ Long 2N1Đ",
        "service_type": "TOUR",
        "variant_id": "5",
        "variant_name": "Vé người lớn",
        "quantity": 2,
        "unit_price": "2500000",
        "total_price": "5000000",
        "availability_start": "2025-11-01T08:00:00Z",
        "availability_end": "2025-11-03T18:00:00Z"
      }
    ],
    
    "participants": [...],
    "tickets": [...]
  }
}
```

#### GET `/api/bookings` - Lấy danh sách orders (Admin)
**Authentication**: Required (Admin role)

**Query Parameters**:
- `status`: Filter theo status (PENDING, CONFIRMED, PAID, CANCELLED, COMPLETED)
- `userId`: Filter theo user
- `page`, `limit`: Pagination
- `startDate`, `endDate`: Filter theo ngày

---

## 💳 2. THÔNG TIN PAYMENT

### API Endpoints

#### GET `/api/payments/booking/:bookingId` - Lấy payments của 1 order
**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "456",
        "booking_id": "123",
        "payment_method": "bank_transfer",
        "transaction_id": "VNP123456",
        "amount": "3000000",
        "currency": "VND",
        "status": "SUCCESS",
        "paid_at": "2025-10-13T10:00:00Z",
        "metadata": {...}
      }
    ]
  }
}
```

#### GET `/api/payments/:paymentId` - Lấy chi tiết 1 payment
**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "456",
      "booking_id": "123",
      "amount": "3000000",
      "status": "SUCCESS",
      "payment_method": "bank_transfer",
      ...
    }
  }
}
```

---

## 📊 3. THÔNG TIN YÊU CẦU

### ✅ Thông tin Order bao gồm:

| Thông tin | Field | Có sẵn |
|-----------|-------|--------|
| Order ID | `booking.id` | ✅ |
| Booking Code | `booking.booking_code` | ✅ |
| Total Amount | `booking.total_amount` | ✅ |
| Currency | `booking.currency` | ✅ |
| Status | `booking.status` | ✅ |
| Buyer Info | `buyer_name`, `buyer_email`, `buyer_phone` | ✅ |

### ✅ Thông tin Product (có phân loại):

| Thông tin | Field | Có sẵn |
|-----------|-------|--------|
| Product ID | `booking_items.service_id` | ✅ |
| Product Name | `services.name` | ✅ |
| **Product Type** | `services.service_type` | ✅ |
| Variant ID | `booking_items.variant_id` | ✅ |
| Variant Name | `service_variants.name` | ✅ |
| Quantity | `booking_items.quantity` | ✅ |
| Unit Price | `booking_items.unit_price` | ✅ |
| Total Price | `booking_items.total_price` | ✅ |

**Product Types (Phân loại)**:
- `TOUR` - Tour du lịch
- `FLIGHT` - Vé máy bay
- `HOTEL` - Khách sạn
- `COMBO` - Gói combo

### ✅ Thông tin Payment:

| Thông tin | Field | Có sẵn |
|-----------|-------|--------|
| Payment ID | `payments.id` | ✅ |
| Order ID | `payments.booking_id` | ✅ |
| Payment Amount | `payments.amount` | ✅ |
| Payment Status | `payments.status` | ✅ |
| Payment Method | `payments.payment_method` | ✅ |
| Transaction ID | `payments.transaction_id` | ✅ |

### ✅ Payment Status (Đủ/Thiếu):

Tính toán:
```javascript
const totalAmount = booking.total_amount;
const paidAmount = payments.reduce((sum, p) => {
  return p.status === 'SUCCESS' ? sum + p.amount : sum;
}, 0);

const paymentStatus = {
  total: totalAmount,
  paid: paidAmount,
  remaining: totalAmount - paidAmount,
  status: paidAmount >= totalAmount ? 'PAID_FULL' : 'PAID_PARTIAL'
};
```

---

## 🗄️ 4. DATABASE STRUCTURE

### Bảng `bookings`
```sql
- id (bigint)
- booking_code (varchar) UNIQUE
- buyer_party_id (bigint) → parties.id
- total_amount (numeric)
- currency (varchar)
- status (enum: PENDING, CONFIRMED, PAID, CANCELLED, COMPLETED)
- note (text)
- created_at, updated_at
```

### Bảng `booking_items`
```sql
- id (bigint)
- booking_id (bigint) → bookings.id
- service_id (bigint) → services.id
- variant_id (bigint) → service_variants.id
- availability_id (bigint) → service_availabilities.id
- quantity (integer)
- unit_price (numeric)
- total_price (numeric)
- currency (varchar)
- note (text)
- created_at, updated_at
```

### Bảng `services`
```sql
- id (bigint)
- name (varchar)
- service_type (enum: TOUR, FLIGHT, HOTEL, COMBO) ← PHÂN LOẠI
- description (text)
- status (enum)
- created_at, updated_at
```

### Bảng `payments`
```sql
- id (bigint)
- booking_id (bigint) → bookings.id
- payment_method (varchar)
- transaction_id (varchar)
- amount (numeric)
- currency (varchar)
- status (varchar: SUCCESS, PENDING, FAILED, REFUNDED)
- paid_at (timestamp)
- metadata (jsonb)
- created_at, updated_at
```

---

## 📝 5. QUERY MẪU

### Lấy Order với đầy đủ thông tin Product và Payment

```sql
SELECT 
  -- Order info
  b.id as order_id,
  b.booking_code,
  b.total_amount,
  b.currency,
  b.status as order_status,
  b.created_at,
  
  -- Buyer info
  p.full_name as buyer_name,
  p.email as buyer_email,
  p.phone_number as buyer_phone,
  
  -- Products (aggregated)
  json_agg(
    DISTINCT jsonb_build_object(
      'item_id', bi.id,
      'service_id', bi.service_id,
      'service_name', s.name,
      'service_type', s.service_type,  -- PHÂN LOẠI
      'variant_id', bi.variant_id,
      'variant_name', sv.name,
      'quantity', bi.quantity,
      'unit_price', bi.unit_price,
      'total_price', bi.total_price
    )
  ) as products,
  
  -- Payments (aggregated)
  json_agg(
    DISTINCT jsonb_build_object(
      'payment_id', pay.id,
      'amount', pay.amount,
      'status', pay.status,
      'payment_method', pay.payment_method,
      'transaction_id', pay.transaction_id,
      'paid_at', pay.paid_at
    )
  ) FILTER (WHERE pay.id IS NOT NULL) as payments,
  
  -- Payment summary
  COALESCE(SUM(CASE WHEN pay.status = 'SUCCESS' THEN pay.amount ELSE 0 END), 0) as total_paid,
  b.total_amount - COALESCE(SUM(CASE WHEN pay.status = 'SUCCESS' THEN pay.amount ELSE 0 END), 0) as remaining_amount,
  CASE 
    WHEN COALESCE(SUM(CASE WHEN pay.status = 'SUCCESS' THEN pay.amount ELSE 0 END), 0) >= b.total_amount 
    THEN 'PAID_FULL' 
    ELSE 'PAID_PARTIAL' 
  END as payment_status

FROM bookings b
LEFT JOIN parties p ON b.buyer_party_id = p.id
LEFT JOIN booking_items bi ON b.id = bi.booking_id
LEFT JOIN services s ON bi.service_id = s.id
LEFT JOIN service_variants sv ON bi.variant_id = sv.id
LEFT JOIN payments pay ON b.id = pay.booking_id

WHERE b.id = $1

GROUP BY b.id, p.full_name, p.email, p.phone_number;
```

---

## 🔧 6. CÁCH SỬ DỤNG

### Frontend - Lấy thông tin order

```javascript
import { api } from './api';

// Lấy chi tiết order
const getOrderDetails = async (orderId) => {
  const response = await api.get(`/bookings/${orderId}`);
  return response.data;
};

// Lấy payments của order
const getOrderPayments = async (orderId) => {
  const response = await api.get(`/payments/booking/${orderId}`);
  return response.data.payments;
};

// Tính payment status
const calculatePaymentStatus = (order, payments) => {
  const totalAmount = parseFloat(order.total_amount);
  const paidAmount = payments
    .filter(p => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);
  
  return {
    total: totalAmount,
    paid: paidAmount,
    remaining: totalAmount - paidAmount,
    status: paidAmount >= totalAmount ? 'PAID_FULL' : 'PAID_PARTIAL',
    percentage: (paidAmount / totalAmount * 100).toFixed(2)
  };
};
```

### Backend - Tạo endpoint mới (nếu cần)

```javascript
// GET /api/orders/:id/complete - Lấy order + payment trong 1 request
router.get('/:id/complete', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get order
    const orderRes = await query(`
      SELECT b.*, p.full_name, p.email, p.phone_number
      FROM bookings b
      LEFT JOIN parties p ON b.buyer_party_id = p.id
      WHERE b.id = $1
    `, [id]);
    
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    const order = orderRes.rows[0];
    
    // Get items with service info
    const itemsRes = await query(`
      SELECT 
        bi.*,
        s.name as service_name,
        s.service_type,
        sv.name as variant_name
      FROM booking_items bi
      LEFT JOIN services s ON bi.service_id = s.id
      LEFT JOIN service_variants sv ON bi.variant_id = sv.id
      WHERE bi.booking_id = $1
    `, [id]);
    
    // Get payments
    const paymentsRes = await query(`
      SELECT * FROM payments WHERE booking_id = $1
    `, [id]);
    
    // Calculate payment status
    const totalAmount = parseFloat(order.total_amount);
    const paidAmount = paymentsRes.rows
      .filter(p => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
    res.json({
      success: true,
      data: {
        order: {
          ...order,
          items: itemsRes.rows
        },
        payments: paymentsRes.rows,
        payment_summary: {
          total_amount: totalAmount,
          paid_amount: paidAmount,
          remaining_amount: totalAmount - paidAmount,
          status: paidAmount >= totalAmount ? 'PAID_FULL' : 'PAID_PARTIAL'
        }
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
```

---

## ✅ 7. CHECKLIST YÊU CẦU

### Thông tin Order
- ✅ Order ID
- ✅ Product ID
- ✅ Product Variant ID
- ✅ **Product Type (Phân loại: TOUR/FLIGHT/HOTEL/COMBO)**
- ✅ Product Name
- ✅ Quantity
- ✅ Unit Price
- ✅ Total Price

### Thông tin Payment
- ✅ Payment ID
- ✅ Order ID (booking_id)
- ✅ Product ID (qua booking_items)
- ✅ Product Variant ID (qua booking_items)
- ✅ Total Amount (order total)
- ✅ Payment Amount (mỗi payment)
- ✅ **Payment Status (PAID_FULL / PAID_PARTIAL)**

### API Endpoints
- ✅ GET `/api/bookings/:id` - Chi tiết order
- ✅ GET `/api/bookings` - Danh sách orders
- ✅ GET `/api/payments/booking/:bookingId` - Payments của order
- ✅ GET `/api/payments/:paymentId` - Chi tiết payment
- ✅ POST `/api/bookings` - Tạo order mới
- ✅ POST `/api/payments` - Tạo payment mới

---

## 🎯 8. KẾT LUẬN

### ✅ HỆ THỐNG ĐÃ CÓ ĐẦY ĐỦ:

1. **Database structure** với đầy đủ bảng và quan hệ
2. **API endpoints** để lấy thông tin order và payment
3. **Phân loại sản phẩm** qua `service_type` (TOUR/FLIGHT/HOTEL/COMBO)
4. **Tính toán payment status** (đủ/thiếu) dựa trên tổng amount và paid amount
5. **Chi tiết đầy đủ** về products, variants, và payments

### 📝 KHÔNG CẦN LÀM GÌ THÊM

Tất cả thông tin yêu cầu đã có sẵn trong hệ thống. Chỉ cần:
1. Sử dụng API endpoints hiện có
2. Tính toán payment status từ dữ liệu trả về
3. Hiển thị thông tin trên frontend

### 🔍 NẾU CẦN THÊM

Có thể tạo thêm 1 endpoint tổng hợp `/api/orders/:id/complete` để trả về tất cả thông tin (order + items + payments + payment_summary) trong 1 request duy nhất, giảm số lượng API calls từ frontend.

---

## 📚 TÀI LIỆU THAM KHẢO

- **File routes**: `backend/routes/bookings.js`, `backend/routes/payments.js`
- **Database structure**: `DATABASE_STRUCTURE.md`
- **Test script**: `backend/scripts/checkOrderPaymentStructure.js`
