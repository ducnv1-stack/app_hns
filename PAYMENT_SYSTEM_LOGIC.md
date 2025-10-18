# 💳 PAYMENT SYSTEM - LOGIC & IMPLEMENTATION

## 🎯 Tổng quan

### Payment Flow cơ bản:
```
User chọn Tour → Tạo Booking → Chọn Payment Method → Thanh toán → Xác nhận → Hoàn tất
```

---

## 📊 Database Structure

### Bảng `payments`:
```sql
- id: Payment ID
- booking_id: Link đến booking
- payment_method: bank_transfer/credit_card/e_wallet/cash
- transaction_id: ID từ gateway (VNPay/Stripe)
- amount: Số tiền thanh toán
- currency: VND
- status: PENDING/SUCCESS/FAILED/REFUNDED
- paid_at: Thời gian thanh toán
- metadata: JSONB (thông tin bổ sung)
```

---

## 🔄 Payment Flow Chi tiết

### Flow 1: VNPay (Bank Transfer/E-Wallet)

```
1. User chọn "Chuyển khoản ngân hàng"
   ↓
2. Frontend gọi: POST /api/payments
   {
     booking_id: 123,
     amount: 5000000,
     payment_method: "bank_transfer"
   }
   ↓
3. Backend tạo payment record (status: PENDING)
   ↓
4. Backend gọi VNPay API → Nhận payment_url
   ↓
5. Backend trả về: { payment_url: "https://vnpay.vn/..." }
   ↓
6. Frontend redirect user đến payment_url
   ↓
7. User thanh toán trên VNPay
   ↓
8. VNPay callback: GET /api/payments/vnpay/callback?vnp_ResponseCode=00&...
   ↓
9. Backend verify signature
   ↓
10. Backend update payment status → SUCCESS
    ↓
11. Backend update booking status → CONFIRMED/PAID
    ↓
12. Redirect user về: /payment/success
```

### Flow 2: Stripe (Credit Card)

```
1. User chọn "Thẻ tín dụng"
   ↓
2. Frontend gọi: POST /api/payments
   ↓
3. Backend tạo Stripe PaymentIntent
   ↓
4. Backend trả về: { client_secret: "pi_xxx_secret_yyy" }
   ↓
5. Frontend hiển thị Stripe card form
   ↓
6. User nhập thông tin thẻ
   ↓
7. Frontend gọi: stripe.confirmCardPayment(client_secret)
   ↓
8. Stripe xử lý thanh toán
   ↓
9. Stripe webhook: POST /api/payments/stripe/webhook
   ↓
10. Backend update payment status → SUCCESS
    ↓
11. Frontend redirect: /payment/success
```

### Flow 3: Cash (Tiền mặt)

```
1. User chọn "Tiền mặt"
   ↓
2. Backend tạo payment (status: PENDING)
   ↓
3. Hiển thị hướng dẫn: "Vui lòng đến văn phòng thanh toán"
   ↓
4. User đến văn phòng
   ↓
5. Admin xác nhận: PUT /api/admin/payments/123/confirm
   ↓
6. Payment status → SUCCESS
```

---

## 💰 Partial Payment (Thanh toán một phần)

### Ví dụ:
```
Booking Total: 10,000,000 VND

Payment 1 (Đặt cọc 30%):
- Amount: 3,000,000 VND
- Status: SUCCESS
- Booking Status: CONFIRMED

Payment 2 (Còn lại 70%):
- Amount: 7,000,000 VND
- Status: PENDING
- Booking Status: CONFIRMED

Sau khi Payment 2 SUCCESS:
- Total Paid: 10,000,000 VND
- Booking Status: PAID
```

### Logic kiểm tra:
```javascript
// Check if booking is fully paid
const totalPaid = await pool.query(`
  SELECT SUM(amount) as total
  FROM payments
  WHERE booking_id = $1 AND status = 'SUCCESS'
`, [booking_id]);

if (totalPaid >= booking.total_amount) {
  // Fully paid
  await pool.query(`UPDATE bookings SET status = 'PAID' WHERE id = $1`, [booking_id]);
} else {
  // Partially paid
  await pool.query(`UPDATE bookings SET status = 'CONFIRMED' WHERE id = $1`, [booking_id]);
}
```

---

## 🔐 Security Best Practices

### 1. Verify Payment on Backend
```javascript
// ❌ NEVER trust client
if (req.body.payment_success) {
  updateBooking(); // DANGEROUS!
}

// ✅ ALWAYS verify from gateway
const isValid = vnpayService.verifySignature(req.query);
if (isValid && vnp_ResponseCode === '00') {
  updatePayment();
}
```

### 2. Use HTTPS
- All payment URLs must use HTTPS
- Callback URLs must use HTTPS

### 3. Store Sensitive Data Securely
```javascript
// .env file
VNP_TMN_CODE=your_terminal_code
VNP_HASH_SECRET=your_secret_key
STRIPE_SECRET_KEY=sk_test_xxx
```

---

## 🧪 Testing

### Test VNPay Sandbox:
```javascript
// Test credentials
VNP_TMN_CODE: "DEMO"
VNP_HASH_SECRET: "DEMOSECRET"

// Test cards
Bank: NCB
Card: 9704198526191432198
Name: NGUYEN VAN A
Date: 07/15
OTP: 123456
```

### Test Stripe:
```javascript
// Test card numbers
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
```

---

## 📝 Implementation Checklist

### Backend:
- [ ] Create payments table
- [ ] Implement payment routes
- [ ] Integrate VNPay service
- [ ] Integrate Stripe service
- [ ] Handle callbacks/webhooks
- [ ] Implement refund logic
- [ ] Add payment validation
- [ ] Setup environment variables

### Frontend:
- [ ] Payment selection UI
- [ ] Payment amount input (partial/full)
- [ ] Stripe card form integration
- [ ] Payment success page
- [ ] Payment failed page
- [ ] Payment history page
- [ ] Loading states
- [ ] Error handling

### Testing:
- [ ] Test VNPay flow
- [ ] Test Stripe flow
- [ ] Test partial payment
- [ ] Test refund
- [ ] Test error cases
- [ ] Test webhook security

---

## 📚 Resources

- VNPay Docs: https://sandbox.vnpayment.vn/apis/docs/
- Stripe Docs: https://stripe.com/docs/api
- Payment Security: https://www.pcisecuritystandards.org/

---

**Tóm tắt:** Payment system cần xử lý multiple methods, verify từ gateway, support partial payment, và đảm bảo security. Flow chính là: Create Payment → Redirect to Gateway → Callback → Verify → Update Status.
