const Joi = require('joi');

// Tour creation validation schema
const tourCreateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Tên tour phải có ít nhất 3 ký tự',
      'string.max': 'Tên tour không được vượt quá 200 ký tự',
      'any.required': 'Tên tour là bắt buộc'
    }),

  description: Joi.string()
    .min(10)
    .max(10000)
    .required()
    .messages({
      'string.min': 'Mô tả tour phải có ít nhất 10 ký tự',
      'string.max': 'Mô tả tour không được vượt quá 10000 ký tự',
      'any.required': 'Mô tả tour là bắt buộc'
    }),

  price: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.min': 'Giá tour phải lớn hơn hoặc bằng 0',
      'any.required': 'Giá tour là bắt buộc'
    }),

  currency: Joi.string()
    .valid('VND', 'USD', 'EUR')
    .default('VND')
    .messages({
      'any.only': 'Loại tiền tệ không hợp lệ'
    }),

  service_type: Joi.string()
    .valid('TOUR', 'HOTEL', 'FLIGHT', 'COMBO', 'TRANSPORT', 'ACTIVITY')
    .default('TOUR')
    .messages({
      'any.only': 'Loại dịch vụ không hợp lệ'
    }),

  location: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Địa điểm phải có ít nhất 2 ký tự',
      'string.max': 'Địa điểm không được vượt quá 100 ký tự',
      'any.required': 'Địa điểm là bắt buộc'
    }),

  duration_days: Joi.number()
    .integer()
    .min(1)
    .max(30)
    .required()
    .messages({
      'number.integer': 'Số ngày phải là số nguyên',
      'number.min': 'Số ngày phải ít nhất 1 ngày',
      'number.max': 'Số ngày không được vượt quá 30 ngày',
      'any.required': 'Số ngày là bắt buộc'
    }),

  max_participants: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .required()
    .messages({
      'number.integer': 'Số lượng tối đa phải là số nguyên',
      'number.min': 'Số lượng tối đa phải ít nhất 1 người',
      'number.max': 'Số lượng tối đa không được vượt quá 100 người',
      'any.required': 'Số lượng tối đa là bắt buộc'
    }),

  min_participants: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(1)
    .messages({
      'number.integer': 'Số lượng tối thiểu phải là số nguyên',
      'number.min': 'Số lượng tối thiểu phải ít nhất 1 người',
      'number.max': 'Số lượng tối thiểu không được vượt quá 50 người'
    }),

  is_active: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Trạng thái hoạt động phải là true hoặc false'
    }),

  metadata: Joi.object({
    highlights: Joi.array().items(Joi.string()).optional(),
    included: Joi.array().items(Joi.string()).optional(),
    excluded: Joi.array().items(Joi.string()).optional(),
    itinerary: Joi.array().items(Joi.object({
      day: Joi.number().integer().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      activities: Joi.array().items(Joi.string()).optional()
    })).optional(),
    requirements: Joi.array().items(Joi.string()).optional(),
    cancellation_policy: Joi.string().optional(),
    images: Joi.array().items(Joi.string().uri()).optional()
  }).optional()
}).unknown(true);

// Tour update validation schema (all fields optional)
const tourUpdateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(200)
    .optional(),

  description: Joi.alternatives().conditional('status', {
    is: 'ACTIVE',
    then: Joi.string().min(10).max(10000),
    otherwise: Joi.string().max(10000).allow('')
  }).optional(),

  price: Joi.number()
    .min(0)
    .optional(),

  currency: Joi.string()
    .valid('VND', 'USD', 'EUR')
    .optional(),

  service_type: Joi.string()
    .valid('TOUR', 'HOTEL', 'FLIGHT', 'COMBO', 'TRANSPORT', 'ACTIVITY')
    .optional(),

  location: Joi.string()
    .min(2)
    .max(100)
    .optional(),

  duration_days: Joi.number()
    .integer()
    .min(1)
    .max(30)
    .optional(),

  max_participants: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional(),

  min_participants: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .optional(),

  is_active: Joi.boolean()
    .optional(),

  metadata: Joi.object({
    highlights: Joi.array().items(Joi.string()).optional(),
    included: Joi.array().items(Joi.string()).optional(),
    excluded: Joi.array().items(Joi.string()).optional(),
    itinerary: Joi.array().items(Joi.object({
      day: Joi.number().integer().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      activities: Joi.array().items(Joi.string()).optional()
    })).optional(),
    requirements: Joi.array().items(Joi.string()).optional(),
    cancellation_policy: Joi.string().optional(),
    images: Joi.array().items(Joi.string().uri()).optional()
  }).optional(),

  // Additional fields for new schema
  short_description: Joi.string().max(500).optional().allow(''),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'DRAFT').optional(),
  country: Joi.string().max(100).optional().allow(''),
  itinerary: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.object({
      day: Joi.number().integer().optional(),
      title: Joi.string().optional().allow(''),
      description: Joi.string().optional().allow('')
    }))
  ).optional().allow(null),

  // Hotel fields
  hotel_name: Joi.string().max(255).optional().allow(''),
  hotel_address: Joi.string().optional().allow(''),
  star_rating: Joi.number().integer().min(1).max(5).optional(),
  room_types: Joi.string().optional().allow(''),
  bed_types: Joi.string().optional().allow(''),
  room_area: Joi.alternatives().try(Joi.number(), Joi.string()).optional().allow(''),
  max_occupancy: Joi.number().integer().min(1).optional(),
  check_in_time: Joi.string().optional().allow(''),
  check_out_time: Joi.string().optional().allow(''),
  amenities: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional().allow(null),

  // Flight fields
  airline: Joi.string().max(100).optional().allow(''),
  flight_number: Joi.string().max(50).optional().allow(''),
  departure_airport: Joi.string().max(100).optional().allow(''),
  arrival_airport: Joi.string().max(100).optional().allow(''),
  departure_time: Joi.string().optional().allow(''),
  arrival_time: Joi.string().optional().allow(''),
  aircraft_type: Joi.string().max(100).optional().allow(''),
  baggage_allowance: Joi.string().max(100).optional().allow(''),
  cabin_class: Joi.string().valid('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST').optional().allow('')
});

// Tour query filters validation
const tourFiltersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().max(100).optional().allow(''),
  category: Joi.string().max(50).optional().allow(''),
  status: Joi.string().valid('active', 'inactive', 'draft', 'all', '').default('all'),
  minPrice: Joi.number().min(0).optional().allow(''),
  maxPrice: Joi.number().min(0).optional().allow(''),
  country: Joi.string().max(100).optional().allow(''),
  location: Joi.string().max(100).optional().allow(''),
  sortBy: Joi.string().valid('name', 'price', 'created_at', 'popularity').default('created_at').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc').optional()
});

// Bulk operations validation
const bulkUpdateSchema = Joi.object({
  tourIds: Joi.array().items(Joi.number().integer()).min(1).max(100).required(),
  updates: Joi.object({
    is_active: Joi.boolean().optional()
  }).required()
});

// Validation functions
const validateTourCreate = (data) => {
  return tourCreateSchema.validate(data, { abortEarly: false });
};

const validateTourUpdate = (data) => {
  return tourUpdateSchema.validate(data, { abortEarly: false, allowUnknown: true });
};

const validateTourFilters = (data) => {
  return tourFiltersSchema.validate(data, { abortEarly: false });
};

const validateBulkUpdate = (data) => {
  return bulkUpdateSchema.validate(data, { abortEarly: false });
};

// Error formatting helper
const formatValidationErrors = (error) => {
  if (!error.details) return error.message;
  
  return error.details.map(detail => ({
    field: detail.path.join('.'),
    message: detail.message,
    value: detail.context?.value
  }));
};

module.exports = {
  tourCreateSchema,
  tourUpdateSchema,
  tourFiltersSchema,
  bulkUpdateSchema,
  validateTourCreate,
  validateTourUpdate,
  validateTourFilters,
  validateBulkUpdate,
  formatValidationErrors
};
