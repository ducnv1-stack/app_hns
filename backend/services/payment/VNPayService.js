const crypto = require('crypto');
const querystring = require('querystring');

class VNPayService {
  constructor() {
    this.vnp_TmnCode = process.env.VNP_TMNCODE || 'DEMO123';
    this.vnp_HashSecret = process.env.VNP_HASHSECRET || 'DEMO123456789';
    this.vnp_Url = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    this.vnp_ReturnUrl = process.env.VNP_RETURN_URL || 'http://localhost:5000/api/payments/vnpay/return';
    this.vnp_ApiUrl = process.env.VNP_API_URL || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction';
  }

  // Create payment URL for VNPay
  createPaymentUrl(paymentData) {
    const {
      payment_id,
      amount,
      orderInfo,
      returnUrl,
      ipAddr = '127.0.0.1'
    } = paymentData;

    // Convert amount to VND cents (VNPay requires amount in smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    const vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: payment_id,
      vnp_OrderInfo: orderInfo || `Payment for booking ${payment_id}`,
      vnp_OrderType: 'other',
      vnp_Amount: amountInCents,
      vnp_ReturnUrl: returnUrl || this.vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: this.formatDate(new Date())
    };

    // Sort parameters
    const sortedParams = this.sortObject(vnp_Params);

    // Create signature
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    sortedParams['vnp_SecureHash'] = signed;

    // Build payment URL
    const paymentUrl = `${this.vnp_Url}?${querystring.stringify(sortedParams, { encode: false })}`;

    return {
      paymentUrl,
      transactionRef: payment_id,
      amount: amountInCents
    };
  }

  // Verify return data from VNPay
  verifyReturnData(vnp_Params) {
    try {
    const secureHash = vnp_Params['vnp_SecureHash'];

    // Remove secure hash for verification
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sort parameters
    const sortedParams = this.sortObject(vnp_Params);

    // Create signature for verification
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return signed === secureHash;
  } catch (error) {
    console.error('VNPay verification error:', error);
    return false;
  }
  }

  // Parse return data and determine payment status
  parseReturnData(vnp_Params) {
    const isValid = this.verifyReturnData(vnp_Params);

    if (!isValid) {
      return {
        success: false,
        error: 'Invalid signature'
      };
    }

    const responseCode = vnp_Params['vnp_ResponseCode'];
    const transactionRef = vnp_Params['vnp_TxnRef'];
    const amount = parseInt(vnp_Params['vnp_Amount']) / 100; // Convert back from cents
    const bankCode = vnp_Params['vnp_BankCode'];
    const bankTranNo = vnp_Params['vnp_BankTranNo'];
    const cardType = vnp_Params['vnp_CardType'];
    const orderInfo = vnp_Params['vnp_OrderInfo'];
    const payDate = vnp_Params['vnp_PayDate'];
    const transactionNo = vnp_Params['vnp_TransactionNo'];

    let status = 'failed';
    let message = '';

    switch (responseCode) {
      case '00':
        status = 'completed';
        message = 'Transaction successful';
        break;
      case '01':
        status = 'failed';
        message = 'Transaction failed due to card not enrolled in 3D Secure';
        break;
      case '02':
        status = 'failed';
        message = 'Transaction failed due to invalid card';
        break;
      case '04':
        status = 'failed';
        message = 'Transaction failed due to insufficient funds';
        break;
      case '05':
        status = 'failed';
        message = 'Transaction failed due to incorrect payment information';
        break;
      case '06':
        status = 'failed';
        message = 'Transaction failed due to system error';
        break;
      case '07':
        status = 'failed';
        message = 'Transaction failed due to suspicious transaction';
        break;
      case '09':
        status = 'failed';
        message = 'Transaction failed due to expired card';
        break;
      case '10':
        status = 'failed';
        message = 'Transaction failed due to card blocked';
        break;
      case '11':
        status = 'failed';
        message = 'Transaction failed due to card type not supported';
        break;
      case '12':
        status = 'failed';
        message = 'Transaction failed due to invalid CVV/CVC';
        break;
      case '13':
        status = 'failed';
        message = 'Transaction failed due to invalid amount';
        break;
      case '24':
        status = 'cancelled';
        message = 'Transaction cancelled by user';
        break;
      case '25':
        status = 'failed';
        message = 'Transaction failed due to invalid card';
        break;
      default:
        status = 'failed';
        message = 'Unknown response code';
    }

    return {
      success: status === 'completed',
      status,
      message,
      data: {
        transactionRef,
        amount,
        responseCode,
        bankCode,
        bankTranNo,
        cardType,
        orderInfo,
        payDate,
        transactionNo,
        gatewayResponse: vnp_Params
      }
    };
  }

  // Query payment status from VNPay
  async queryPaymentStatus(transactionRef) {
    try {
      const vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'querydr',
        vnp_TmnCode: this.vnp_TmnCode,
        vnp_TxnRef: transactionRef,
        vnp_OrderInfo: `Query payment status for ${transactionRef}`,
        vnp_CreateDate: this.formatDate(new Date())
      };

      // Sort and sign
      const sortedParams = this.sortObject(vnp_Params);
      const signData = querystring.stringify(sortedParams, { encode: false });
      const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      sortedParams['vnp_SecureHash'] = signed;

      // Make request to VNPay API (this would typically use a HTTP client)
      // For now, return mock response
      return {
        success: true,
        status: 'completed',
        data: {
          transactionRef,
          amount: 0, // Would be actual amount from response
          gatewayResponse: sortedParams
        }
      };
    } catch (error) {
      console.error('VNPay query error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper methods
  sortObject(obj) {
    const sorted = {};
    const str = [];
    let key;

    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }

    str.sort();

    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }

    return sorted;
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
}

module.exports = VNPayService;
