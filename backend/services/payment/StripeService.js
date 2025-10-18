const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_demo');

class StripeService {
  constructor() {
    this.currency = 'usd'; // Stripe works with USD, EUR, etc.
  }

  // Create payment intent for card payments
  async createPaymentIntent(paymentData) {
    try {
      const {
        amount,
        currency = this.currency,
        booking_id,
        user_email,
        description
      } = paymentData;

      // Convert amount to cents (Stripe requires amount in smallest currency unit)
      const amountInCents = Math.round(amount * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: currency.toLowerCase(),
        metadata: {
          booking_id: booking_id.toString(),
          user_email: user_email
        },
        description: description || `Payment for booking ${booking_id}`,
        automatic_payment_methods: {
          enabled: true,
        },
        // For testing, you can set confirm: false to get payment intent without charging
        // confirm: false
      });

      return {
        success: true,
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        amount: amountInCents,
        currency: currency.toLowerCase(),
        status: paymentIntent.status
      };
    } catch (error) {
      console.error('Stripe create payment intent error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Confirm payment intent (for 3D Secure payments)
  async confirmPaymentIntent(paymentIntentId, paymentMethodId) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(
        paymentIntentId,
        { payment_method: paymentMethodId }
      );

      return {
        success: true,
        status: paymentIntent.status,
        requires_action: paymentIntent.status === 'requires_action',
        client_secret: paymentIntent.client_secret,
        next_action: paymentIntent.next_action
      };
    } catch (error) {
      console.error('Stripe confirm payment intent error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Retrieve payment intent status
  async getPaymentIntentStatus(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      let status = 'pending';
      switch (paymentIntent.status) {
        case 'succeeded':
          status = 'completed';
          break;
        case 'requires_payment_method':
        case 'requires_confirmation':
        case 'requires_action':
          status = 'pending';
          break;
        case 'canceled':
          status = 'cancelled';
          break;
        case 'requires_capture':
          status = 'pending';
          break;
        default:
          status = 'failed';
      }

      return {
        success: true,
        status,
        payment_intent: paymentIntent,
        gateway_response: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          metadata: paymentIntent.metadata,
          charges: paymentIntent.charges
        }
      };
    } catch (error) {
      console.error('Stripe get payment intent error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create refund
  async createRefund(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      const refundParams = {
        payment_intent: paymentIntentId,
        reason: reason
      };

      if (amount) {
        // Convert to cents
        refundParams.amount = Math.round(amount * 100);
      }

      const refund = await stripe.refunds.create(refundParams);

      return {
        success: true,
        refund_id: refund.id,
        amount: refund.amount,
        currency: refund.currency,
        status: refund.status,
        reason: refund.reason
      };
    } catch (error) {
      console.error('Stripe refund error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create customer for saving payment methods
  async createCustomer(email, name = null) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          created_at: new Date().toISOString()
        }
      });

      return {
        success: true,
        customer_id: customer.id,
        email: customer.email
      };
    } catch (error) {
      console.error('Stripe create customer error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Attach payment method to customer
  async attachPaymentMethod(customerId, paymentMethodId) {
    try {
      const paymentMethod = await stripe.paymentMethods.attach(
        paymentMethodId,
        { customer: customerId }
      );

      return {
        success: true,
        payment_method_id: paymentMethod.id,
        type: paymentMethod.type,
        card: paymentMethod.card
      };
    } catch (error) {
      console.error('Stripe attach payment method error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create setup intent for saving payment methods
  async createSetupIntent(customerId, paymentMethodTypes = ['card']) {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: paymentMethodTypes,
        metadata: {
          customer_id: customerId
        }
      });

      return {
        success: true,
        client_secret: setupIntent.client_secret,
        setup_intent_id: setupIntent.id,
        status: setupIntent.status
      };
    } catch (error) {
      console.error('Stripe create setup intent error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Webhook event verification and processing
  async processWebhookEvent(body, signature) {
    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

      return {
        success: true,
        event_type: event.type,
        event_data: event.data
      };
    } catch (error) {
      console.error('Stripe webhook verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Convert currency amount for Stripe (USD to cents)
  convertToStripeAmount(amount, currency = 'USD') {
    // Stripe requires amounts in smallest currency unit (cents for USD)
    const conversionRates = {
      'USD': 100,
      'EUR': 100,
      'GBP': 100,
      'JPY': 1, // No cents for JPY
      'VND': 1   // VND doesn't use cents
    };

    const rate = conversionRates[currency.toUpperCase()] || 100;
    return Math.round(amount * rate);
  }

  // Convert Stripe amount back to original currency
  convertFromStripeAmount(stripeAmount, currency = 'USD') {
    const conversionRates = {
      'USD': 100,
      'EUR': 100,
      'GBP': 100,
      'JPY': 1,
      'VND': 1
    };

    const rate = conversionRates[currency.toUpperCase()] || 100;
    return stripeAmount / rate;
  }
}

module.exports = StripeService;
