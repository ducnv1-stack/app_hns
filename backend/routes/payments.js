const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const PaymentTransaction = require('../models/PaymentTransaction');
const VNPayService = require('../services/payment/VNPayService');
const StripeService = require('../services/payment/StripeService');
const { authenticate, authorize } = require('../middleware/auth');
const {
  validatePayment,
  validatePaymentStatus,
  validateRefund,
  validatePaymentAmount,
  validateCurrency
} = require('../utils/paymentValidation');

// Initialize payment services
const vnpayService = new VNPayService();
const stripeService = new StripeService();

// Create a new payment
router.post('/', authenticate, async (req, res) => {
  try {
    const { error, value } = validatePayment(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Validate amount
    const amountValidation = validatePaymentAmount(value.amount);
    if (!amountValidation.valid) {
      return res.status(400).json({
        success: false,
        message: amountValidation.error
      });
    }

    // Validate currency
    if (!validateCurrency(value.currency)) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported currency'
      });
    }

    // Create payment record
    const payment = await Payment.create(value);

    // No need for separate transaction log with new structure
    // All transaction info is stored in payment.metadata

    // Generate gateway-specific payment URL/data based on payment method
    let gatewayResponse = {};

    if (payment.payment_method === 'bank_transfer' && payment.metadata?.gateway === 'vnpay') {
      const vnpayData = {
        payment_id: payment.id,
        amount: payment.amount,
        orderInfo: `Payment for booking ${payment.booking_id}`
      };

      const vnpayResult = vnpayService.createPaymentUrl(vnpayData);
      gatewayResponse = {
        gateway: 'vnpay',
        payment_url: vnpayResult.paymentUrl,
        transaction_ref: vnpayResult.transactionRef
      };
    } else if (payment.payment_method === 'credit_card' && payment.metadata?.gateway === 'stripe') {
      const stripeData = {
        amount: payment.amount,
        currency: payment.currency,
        booking_id: payment.booking_id,
        user_email: 'customer@example.com',
        description: `Payment for booking ${payment.booking_id}`
      };

      const stripeResult = await stripeService.createPaymentIntent(stripeData);
      if (stripeResult.success) {
        gatewayResponse = {
          gateway: 'stripe',
          client_secret: stripeResult.client_secret,
          payment_intent_id: stripeResult.payment_intent_id,
          requires_action: stripeResult.status === 'requires_action'
        };
      } else {
        return res.status(400).json({
          success: false,
          message: 'Failed to create Stripe payment intent',
          error: stripeResult.error
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: {
        payment: {
          id: payment.id,
          booking_id: payment.booking_id,
          amount: payment.amount,
          currency: payment.currency,
          payment_method: payment.payment_method,
          status: payment.status
        },
        gateway: gatewayResponse
      }
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get payment status - Authenticated users
router.get('/:paymentId', authenticate, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Get payment transactions (if needed)
    // const transactions = await PaymentTransaction.findByPaymentId(paymentId);

    res.json({
      success: true,
      data: {
        payment
      }
    });

  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// VNPay return URL handler
router.get('/vnpay/return', async (req, res) => {
  try {
    const vnp_Params = req.query;

    // Parse VNPay response
    const vnpayResult = vnpayService.parseReturnData(vnp_Params);

    if (!vnpayResult.success) {
      return res.status(400).json({
        success: false,
        message: vnpayResult.error || 'Payment verification failed'
      });
    }

    const { transactionRef, status, data } = vnpayResult;

    // Update payment status
    const payment = await Payment.updateStatus(
      transactionRef,
      status,
      data.gatewayResponse
    );

    // Create transaction log
    await PaymentTransaction.create({
      payment_id: transactionRef,
      transaction_type: 'payment',
      amount: data.amount,
      currency: 'VND',
      gateway_transaction_id: data.transactionNo,
      status: status === 'completed' ? 'success' : 'failed',
      gateway_response: data.gatewayResponse
    });

    // Redirect to frontend with status
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/payment/result?status=${status}&payment_id=${transactionRef}`;

    res.redirect(redirectUrl);

  } catch (error) {
    console.error('VNPay return handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Stripe webhook handler
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = await stripeService.processWebhookEvent(req.body, sig);

    if (!event.success) {
      return res.status(400).json({
        success: false,
        message: event.error
      });
    }

    const { event_type, event_data } = event;

    // Process different webhook events
    switch (event_type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event_data.object;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event_data.object;
        await handlePaymentIntentFailed(failedPayment);
        break;

      case 'charge.dispute.created':
        // Handle dispute/chargeback
        break;

      default:
        console.log(`Unhandled event type: ${event_type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
});

// Process refund - Admin only
router.post('/:paymentId/refund', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Payment ownership is determined by booking ownership
    // This will be handled by booking service

    // Validate refund data
    const { error, value } = validateRefund(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Check if payment can be refunded
    if (payment.status !== 'SUCCESS') {
      return res.status(400).json({
        success: false,
        message: 'Only successful payments can be refunded'
      });
    }

    // Process refund
    const refund = await Payment.processRefund(
      paymentId,
      value.refund_amount,
      value.refund_reason
    );

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: { refund }
    });

  } catch (error) {
    console.error('Refund processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get payments by booking ID - Authenticated users
router.get('/booking/:bookingId', authenticate, async (req, res) => {
  try {
    const { bookingId } = req.params;

    const payments = await Payment.findByBookingId(bookingId);

    res.json({
      success: true,
      data: { payments }
    });

  } catch (error) {
    console.error('Get booking payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get payment statistics - Admin only
router.get('/stats/overview', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const stats = await Payment.getPaymentStats();

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Helper function to handle successful Stripe payment
async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    const { booking_id } = paymentIntent.metadata;

    // Find payment by booking_id and gateway_transaction_id
    const query = `
      SELECT id FROM payments
      WHERE booking_id = $1 AND gateway_transaction_id = $2
      LIMIT 1
    `;
    const result = await require('../config/database').query(query, [
      booking_id,
      paymentIntent.id
    ]);

    if (result.rows.length > 0) {
      const paymentId = result.rows[0].id;

      // Update payment status
      await Payment.updateStatus(paymentId, 'completed', {
        stripe_payment_intent: paymentIntent
      });

      // Create transaction log
      await PaymentTransaction.create({
        payment_id: paymentId,
        transaction_type: 'payment',
        amount: stripeService.convertFromStripeAmount(paymentIntent.amount, paymentIntent.currency),
        currency: paymentIntent.currency.toUpperCase(),
        gateway_transaction_id: paymentIntent.id,
        status: 'success',
        gateway_response: paymentIntent
      });
    }
  } catch (error) {
    console.error('Handle payment intent succeeded error:', error);
  }
}

// Helper function to handle failed Stripe payment
async function handlePaymentIntentFailed(paymentIntent) {
  try {
    const { booking_id } = paymentIntent.metadata;

    // Find payment by booking_id and gateway_transaction_id
    const query = `
      SELECT id FROM payments
      WHERE booking_id = $1 AND gateway_transaction_id = $2
      LIMIT 1
    `;
    const result = await require('../config/database').query(query, [
      booking_id,
      paymentIntent.id
    ]);

    if (result.rows.length > 0) {
      const paymentId = result.rows[0].id;

      // Update payment status
      await Payment.updateStatus(paymentId, 'failed', {
        stripe_payment_intent: paymentIntent
      });

      // Create transaction log
      await PaymentTransaction.create({
        payment_id: paymentId,
        transaction_type: 'payment',
        amount: stripeService.convertFromStripeAmount(paymentIntent.amount, paymentIntent.currency),
        currency: paymentIntent.currency.toUpperCase(),
        gateway_transaction_id: paymentIntent.id,
        status: 'failed',
        gateway_response: paymentIntent
      });
    }
  } catch (error) {
    console.error('Handle payment intent failed error:', error);
  }
}

module.exports = router;
