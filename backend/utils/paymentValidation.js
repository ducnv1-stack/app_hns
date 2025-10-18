const Joi = require('joi');

// Payment creation validation schema
const paymentSchema = Joi.object({
  booking_id: Joi.number().integer().positive().required(),
  amount: Joi.number().positive().precision(2).required(),
  currency: Joi.string().length(3).default('USD'),
  payment_method: Joi.string().valid('credit_card', 'bank_transfer', 'momo', 'paypal', 'vnpay', 'stripe').required(),
  transaction_id: Joi.string().max(150),
  metadata: Joi.object().default({})
});

// Payment status update validation
const paymentStatusSchema = Joi.object({
  payment_id: Joi.number().integer().positive().required(),
  status: Joi.string().valid('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED').required(),
  transaction_id: Joi.string().max(150),
  metadata: Joi.object().default({})
});

// Refund validation schema
const refundSchema = Joi.object({
  payment_id: Joi.number().integer().positive().required(),
  refund_amount: Joi.number().positive().precision(2).required(),
  refund_reason: Joi.string().max(500).required(),
  notify_customer: Joi.boolean().default(true)
});

// Payment method validation
const paymentMethodSchema = Joi.object({
  type: Joi.string().valid('credit_card', 'bank_account').required(),
  provider: Joi.string().valid('stripe', 'vnpay'),
  is_default: Joi.boolean().default(false),
  card_token: Joi.string().when('type', {
    is: 'credit_card',
    then: Joi.string().required(),
    otherwise: Joi.optional()
  }),
  bank_account_token: Joi.string().when('type', {
    is: 'bank_account',
    then: Joi.string().required(),
    otherwise: Joi.optional()
  })
});

// Validate payment creation data
const validatePayment = (data) => {
  return paymentSchema.validate(data);
};

// Validate payment status update
const validatePaymentStatus = (data) => {
  return paymentStatusSchema.validate(data);
};

// Validate refund request
const validateRefund = (data) => {
  return refundSchema.validate(data);
};

// Validate payment method
const validatePaymentMethod = (data) => {
  return paymentMethodSchema.validate(data);
};

// Payment amount validation
const validatePaymentAmount = (amount, minAmount = 1000, maxAmount = 100000000) => {
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount)) {
    return { valid: false, error: 'Invalid amount format' };
  }

  if (numAmount < minAmount) {
    return { valid: false, error: `Minimum amount is ${minAmount}` };
  }

  if (numAmount > maxAmount) {
    return { valid: false, error: `Maximum amount is ${maxAmount}` };
  }

  return { valid: true };
};

// Payment method availability check
const validatePaymentMethodAvailability = (method, gateway = null) => {
  const availableMethods = {
    vnpay: ['bank_transfer'],
    stripe: ['credit_card'],
    bank_transfer: ['bank_transfer']
  };

  if (gateway && availableMethods[gateway]) {
    return availableMethods[gateway].includes(method);
  }

  // Check if method is generally available
  return Object.values(availableMethods).some(methods => methods.includes(method));
};

// Currency validation
const validateCurrency = (currency) => {
  const supportedCurrencies = ['VND', 'USD', 'EUR'];
  return supportedCurrencies.includes(currency?.toUpperCase());
};

// Provider account validation schema
const providerAccountSchema = Joi.object({
  provider_id: Joi.number().integer().positive().required(),
  account_name: Joi.string().max(255).required(),
  account_number: Joi.string().max(100).required(),
  bank_name: Joi.string().max(255),
  currency: Joi.string().length(3).default('VND'),
  is_default: Joi.boolean().default(true),
  metadata: Joi.object().default({})
});

// Validate provider account
const validateProviderAccount = (data) => {
  return providerAccountSchema.validate(data);
};

module.exports = {
  validatePayment,
  validatePaymentStatus,
  validateRefund,
  validatePaymentMethod,
  validatePaymentAmount,
  validatePaymentMethodAvailability,
  validateCurrency,
  validateProviderAccount
};
