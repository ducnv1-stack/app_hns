# 💡 PAYMENT SYSTEM - CODE EXAMPLES

## 📋 Mục lục
1. [Backend API Examples](#backend-api-examples)
2. [Frontend Component Examples](#frontend-component-examples)
3. [Payment Gateway Integration](#payment-gateway-integration)
4. [Common Scenarios](#common-scenarios)

---

## 🔧 Backend API Examples

### 1. Create Payment Endpoint

```javascript
// backend/routes/payments.js
router.post('/', authenticate, async (req, res) => {
  const { booking_id, amount, payment_method, metadata } = req.body;
  const user_id = req.user.id;

  try {
    // 1. Validate booking
    const booking = await pool.query(
      'SELECT * FROM bookings WHERE id = $1 AND user_id = $2',
      [booking_id, user_id]
    );

    if (booking.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // 2. Calculate remaining amount
    const paidResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total_paid 
       FROM payments 
       WHERE booking_id = $1 AND status = 'SUCCESS'`,
      [booking_id]
    );

    const totalPaid = parseFloat(paidResult.rows[0].total_paid);
    const bookingTotal = parseFloat(booking.rows[0].total_amount);
    const remaining = bookingTotal - totalPaid;

    // 3. Validate amount
    if (amount > remaining) {
      return res.status(400).json({
        success: false,
        error: `Amount exceeds remaining. Remaining: ${remaining} VND`
      });
    }

    // 4. Create payment record
    const payment = await pool.query(
      `INSERT INTO payments (booking_id, payment_method, amount, currency, status, metadata)
       VALUES ($1, $2, $3, 'VND', 'PENDING', $4)
       RETURNING *`,
      [booking_id, payment_method, amount, JSON.stringify(metadata || {})]
    );

    const newPayment = payment.rows[0];

    // 5. Generate gateway URL
    let gatewayResponse = {};

    if (payment_method === 'bank_transfer') {
      const vnpayService = new VNPayService();
      gatewayResponse = vnpayService.createPaymentUrl({
        payment_id: newPayment.id,
        amount: amount,
        orderInfo: `Thanh toán booking #${booking_id}`
      });
    } else if (payment_method === 'credit_card') {
      const stripeService = new StripeService();
      gatewayResponse = await stripeService.createPaymentIntent({
        amount: amount,
        currency: 'vnd',
        payment_id: newPayment.id
      });
    }

    res.json({
      success: true,
      data: {
        payment: newPayment,
        gateway: gatewayResponse
      }
    });

  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ success: false, error: 'Failed to create payment' });
  }
});
```

### 2. VNPay Callback Handler

```javascript
// backend/routes/payments.js
router.get('/vnpay/callback', async (req, res) => {
  try {
    const vnpayService = new VNPayService();
    
    // 1. Verify signature
    const isValid = vnpayService.verifyReturnUrl(req.query);
    if (!isValid) {
      return res.redirect('/payment/failed?reason=invalid_signature');
    }

    // 2. Extract data
    const { vnp_TxnRef, vnp_ResponseCode, vnp_TransactionNo, vnp_Amount } = req.query;
    const payment_id = vnp_TxnRef.split('_')[0];

    // 3. Update payment status
    if (vnp_ResponseCode === '00') {
      // SUCCESS
      await pool.query(
        `UPDATE payments 
         SET status = 'SUCCESS', 
             transaction_id = $1, 
             paid_at = NOW(),
             metadata = jsonb_set(COALESCE(metadata, '{}'::jsonb), '{vnpay_response}', $2::jsonb)
         WHERE id = $3`,
        [vnp_TransactionNo, JSON.stringify(req.query), payment_id]
      );

      // 4. Update booking status
      const bookingCheck = await pool.query(
        `SELECT 
           b.id, 
           b.total_amount,
           COALESCE(SUM(p.amount), 0) as total_paid
         FROM bookings b
         LEFT JOIN payments p ON b.id = p.booking_id AND p.status = 'SUCCESS'
         WHERE b.id = (SELECT booking_id FROM payments WHERE id = $1)
         GROUP BY b.id`,
        [payment_id]
      );

      const booking = bookingCheck.rows[0];
      const newStatus = booking.total_paid >= booking.total_amount ? 'PAID' : 'CONFIRMED';
      
      await pool.query('UPDATE bookings SET status = $1 WHERE id = $2', [newStatus, booking.id]);

      // 5. Send email notification
      // TODO: Implement email service

      res.redirect(`/payment/success?payment_id=${payment_id}`);
    } else {
      // FAILED
      await pool.query(
        `UPDATE payments SET status = 'FAILED', metadata = $1 WHERE id = $2`,
        [JSON.stringify({ vnpay_response: req.query }), payment_id]
      );

      res.redirect(`/payment/failed?payment_id=${payment_id}&code=${vnp_ResponseCode}`);
    }

  } catch (error) {
    console.error('VNPay callback error:', error);
    res.redirect('/payment/failed?reason=system_error');
  }
});
```

### 3. Get Payment History

```javascript
// backend/routes/payments.js
router.get('/booking/:bookingId', authenticate, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const user_id = req.user.id;

    // Verify booking belongs to user
    const booking = await pool.query(
      'SELECT * FROM bookings WHERE id = $1 AND user_id = $2',
      [bookingId, user_id]
    );

    if (booking.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // Get all payments
    const payments = await pool.query(
      `SELECT 
         id,
         payment_method,
         transaction_id,
         amount,
         currency,
         status,
         paid_at,
         created_at
       FROM payments
       WHERE booking_id = $1
       ORDER BY created_at DESC`,
      [bookingId]
    );

    // Calculate summary
    const summary = await pool.query(
      `SELECT 
         b.total_amount,
         COALESCE(SUM(CASE WHEN p.status = 'SUCCESS' THEN p.amount ELSE 0 END), 0) as total_paid,
         COALESCE(SUM(CASE WHEN p.status = 'PENDING' THEN p.amount ELSE 0 END), 0) as pending_amount
       FROM bookings b
       LEFT JOIN payments p ON b.id = p.booking_id
       WHERE b.id = $1
       GROUP BY b.id`,
      [bookingId]
    );

    const summaryData = summary.rows[0];

    res.json({
      success: true,
      data: {
        payments: payments.rows,
        summary: {
          total_amount: summaryData.total_amount,
          total_paid: summaryData.total_paid,
          pending_amount: summaryData.pending_amount,
          remaining: parseFloat(summaryData.total_amount) - parseFloat(summaryData.total_paid)
        }
      }
    });

  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ success: false, error: 'Failed to get payments' });
  }
});
```

---

## 🎨 Frontend Component Examples

### 1. Payment Selection Page

```jsx
// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Building2, Wallet, Banknote } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const response = await bookingService.getBooking(bookingId);
      if (response.success) {
        const bookingData = response.data;
        setBooking(bookingData);
        setAmount(bookingData.remaining_amount);
      }
    } catch (error) {
      console.error('Load booking error:', error);
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert('Vui lòng chọn phương thức thanh toán');
      return;
    }

    if (amount <= 0 || amount > booking.remaining_amount) {
      alert('Số tiền không hợp lệ');
      return;
    }

    setLoading(true);

    try {
      const response = await paymentService.createPayment({
        booking_id: bookingId,
        amount: amount,
        payment_method: selectedMethod,
        metadata: {
          gateway: selectedMethod === 'credit_card' ? 'stripe' : 'vnpay'
        }
      });

      if (response.success) {
        const { payment, gateway } = response.data;

        // Redirect based on payment method
        if (selectedMethod === 'bank_transfer' || selectedMethod === 'e_wallet') {
          // VNPay - redirect to payment URL
          window.location.href = gateway.paymentUrl;
        } else if (selectedMethod === 'credit_card') {
          // Stripe - navigate to card form
          navigate(`/payment/${payment.id}/card`, {
            state: { clientSecret: gateway.client_secret }
          });
        } else if (selectedMethod === 'cash') {
          // Cash - show instructions
          navigate(`/payment/${payment.id}/instructions`);
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return <div className="p-6">Loading...</div>;
  }

  const paymentMethods = [
    {
      id: 'bank_transfer',
      name: 'Chuyển khoản ngân hàng',
      icon: Building2,
      description: 'Thanh toán qua VNPay'
    },
    {
      id: 'credit_card',
      name: 'Thẻ tín dụng/ghi nợ',
      icon: CreditCard,
      description: 'Visa, Mastercard, JCB'
    },
    {
      id: 'e_wallet',
      name: 'Ví điện tử',
      icon: Wallet,
      description: 'Momo, ZaloPay, VNPay'
    },
    {
      id: 'cash',
      name: 'Tiền mặt',
      icon: Banknote,
      description: 'Thanh toán tại văn phòng'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>

      {/* Booking Summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin booking</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Booking ID:</span>
            <span className="font-semibold">#{booking.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tổng tiền:</span>
            <span className="font-semibold">{booking.total_amount.toLocaleString()} VND</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Đã thanh toán:</span>
            <span className="text-green-600 font-semibold">
              {booking.paid_amount.toLocaleString()} VND
            </span>
          </div>
          <div className="flex justify-between text-lg border-t pt-2">
            <span className="font-semibold">Còn lại:</span>
            <span className="text-red-600 font-bold">
              {booking.remaining_amount.toLocaleString()} VND
            </span>
          </div>
        </div>
      </div>

      {/* Payment Amount */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Số tiền thanh toán</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          max={booking.remaining_amount}
          className="w-full px-4 py-3 border rounded-lg text-lg mb-3"
          placeholder="Nhập số tiền"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setAmount(Math.round(booking.remaining_amount * 0.3))}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            30% (Đặt cọc)
          </button>
          <button
            onClick={() => setAmount(Math.round(booking.remaining_amount * 0.5))}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            50%
          </button>
          <button
            onClick={() => setAmount(booking.remaining_amount)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
          >
            Toàn bộ
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-4 border-2 rounded-lg text-left transition ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon className="h-6 w-6 text-gray-700" />
                  <div className="flex-1">
                    <div className="font-semibold">{method.name}</div>
                    <div className="text-sm text-gray-600">{method.description}</div>
                  </div>
                  {selectedMethod === method.id && (
                    <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handlePayment}
        disabled={!selectedMethod || loading}
        className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Đang xử lý...' : `Thanh toán ${amount.toLocaleString()} VND`}
      </button>
    </div>
  );
};

export default PaymentPage;
```

### 2. Payment Success Page

```jsx
// src/pages/PaymentSuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { paymentService } from '../services/paymentService';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const payment_id = searchParams.get('payment_id');
  
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (payment_id) {
      loadPayment();
    }
  }, [payment_id]);

  const loadPayment = async () => {
    try {
      const response = await paymentService.getPayment(payment_id);
      if (response.success) {
        setPayment(response.data);
      }
    } catch (error) {
      console.error('Load payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thanh toán thành công!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã thanh toán. Chúng tôi đã nhận được thanh toán của bạn.
        </p>

        {payment && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã thanh toán:</span>
                <span className="font-semibold">#{payment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-semibold text-green-600">
                  {payment.amount.toLocaleString()} VND
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phương thức:</span>
                <span className="font-semibold">{payment.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-semibold">
                  {new Date(payment.paid_at).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            to={`/bookings/${payment?.booking_id}`}
            className="block w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Xem chi tiết booking
          </Link>
          
          <Link
            to="/dashboard"
            className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
```

---

## 🔌 Payment Gateway Integration

### VNPay Service

```javascript
// backend/services/VNPayService.js
const crypto = require('crypto');
const querystring = require('querystring');

class VNPayService {
  constructor() {
    this.vnp_TmnCode = process.env.VNP_TMN_CODE;
    this.vnp_HashSecret = process.env.VNP_HASH_SECRET;
    this.vnp_Url = process.env.VNP_URL;
    this.vnp_ReturnUrl = process.env.VNP_RETURN_URL;
  }

  createPaymentUrl(data) {
    const { payment_id, amount, orderInfo, bankCode } = data;
    
    const date = new Date();
    const createDate = this.formatDate(date);
    const orderId = `${payment_id}_${Date.now()}`;

    let vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: this.vnp_ReturnUrl,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: createDate
    };

    if (bankCode) {
      vnp_Params.vnp_BankCode = bankCode;
    }

    vnp_Params = this.sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    vnp_Params.vnp_SecureHash = signed;

    const paymentUrl = this.vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: false });

    return {
      paymentUrl,
      transactionRef: orderId
    };
  }

  verifyReturnUrl(vnp_Params) {
    const secureHash = vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    vnp_Params = this.sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return secureHash === signed;
  }

  sortObject(obj) {
    const sorted = {};
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = obj[key];
    });
    return sorted;
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`;
  }
}

module.exports = VNPayService;
```

---

## 📚 Common Scenarios

### Scenario 1: Đặt cọc 30%, thanh toán 70% sau

```javascript
// Step 1: User tạo booking
const booking = {
  id: 123,
  total_amount: 10000000,
  status: 'PENDING'
};

// Step 2: User thanh toán 30% đặt cọc
const payment1 = {
  booking_id: 123,
  amount: 3000000, // 30%
  status: 'SUCCESS'
};
// → Booking status: CONFIRMED

// Step 3: Sau đó user thanh toán 70% còn lại
const payment2 = {
  booking_id: 123,
  amount: 7000000, // 70%
  status: 'SUCCESS'
};
// → Booking status: PAID (fully paid)
```

### Scenario 2: Thanh toán thất bại, retry

```javascript
// Payment 1: FAILED
const payment1 = {
  id: 456,
  booking_id: 123,
  amount: 5000000,
  status: 'FAILED'
};

// User retry với payment mới
const payment2 = {
  id: 457,
  booking_id: 123,
  amount: 5000000,
  status: 'SUCCESS'
};
```

### Scenario 3: Refund

```javascript
// Admin refund payment
POST /api/admin/payments/456/refund
{
  "amount": 3000000,
  "reason": "Customer request cancellation"
}

// Update payment
UPDATE payments 
SET status = 'REFUNDED',
    metadata = jsonb_set(metadata, '{refund_info}', '{
      "refund_amount": 3000000,
      "refund_reason": "Customer request",
      "refunded_at": "2025-10-15T10:00:00Z"
    }')
WHERE id = 456;

// Update booking
UPDATE bookings SET status = 'CANCELLED' WHERE id = 123;
```

---

**Tóm tắt:** Đây là các code examples cụ thể để implement payment system. Bạn có thể copy và customize theo nhu cầu của mình!
