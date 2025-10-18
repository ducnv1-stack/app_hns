const logger = require('../utils/logger');

/**
 * Enhanced Error class với additional context
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true, metadata = {}) {
    super(message);
    
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.metadata = metadata;
    this.timestamp = new Date().toISOString();
    this.stack = this.stack;
    
    // Để capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle different types of errors
 */
const handleDatabaseError = (error) => {
  let message = 'Database error occurred';
  let statusCode = 500;
  let metadata = {};

  switch (error.code) {
    case '23505': // Unique violation
      message = 'Duplicate entry found';
      statusCode = 409;
      metadata.constraint = error.constraint;
      break;
    case '23503': // Foreign key violation
      message = 'Referenced record not found';
      statusCode = 400;
      metadata.constraint = error.constraint;
      break;
    case '23502': // Not null violation
      message = 'Required field is missing';
      statusCode = 400;
      metadata.column = error.column;
      break;
    case '42P01': // Undefined table
      message = 'Database table not found';
      statusCode = 500;
      break;
    case 'ECONNREFUSED':
      message = 'Database connection refused';
      statusCode = 503;
      break;
    default:
      metadata.originalError = error.message;
      metadata.errorCode = error.code;
  }

  return new AppError(message, statusCode, true, metadata);
};

/**
 * Handle JWT errors
 */
const handleJWTError = (error) => {
  let message = 'Authentication error';
  let statusCode = 401;

  if (error.name === 'TokenExpiredError') {
    message = 'Token has expired';
    statusCode = 401;
  } else if (error.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  } else if (error.name === 'NotBeforeError') {
    message = 'Token not active';
    statusCode = 401;
  }

  return new AppError(message, statusCode, true, { jwtError: error.name });
};

/**
 * Handle validation errors (Joi)
 */
const handleValidationError = (error) => {
  const errors = error.details.map(detail => ({
    field: detail.path.join('.'),
    message: detail.message,
    value: detail.context?.value
  }));

  return new AppError('Validation failed', 400, true, {
    validationErrors: errors,
    totalErrors: errors.length
  });
};

/**
 * Handle file upload errors
 */
const handleFileUploadError = (error) => {
  let message = 'File upload error';
  let statusCode = 400;

  if (error.code === 'LIMIT_FILE_SIZE') {
    message = 'File too large';
    statusCode = 413;
  } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    message = 'Unexpected file field';
    statusCode = 400;
  } else if (error.code === 'LIMIT_FILE_COUNT') {
    message = 'Too many files';
    statusCode = 400;
  }

  return new AppError(message, statusCode, true, {
    uploadError: error.code,
    originalMessage: error.message
  });
};

/**
 * Handle rate limit errors
 */
const handleRateLimitError = (error) => {
  return new AppError('Too many requests', 429, true, {
    limit: error.limit,
    remaining: error.remaining,
    resetTime: error.resetTime
  });
};

/**
 * Main error handling middleware
 */
const errorHandler = (error, req, res, next) => {
  let appError = error;

  // Log the original error
  logger.error('Error occurred in request', error, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user ? req.user.userId : null,
    body: req.method !== 'GET' ? req.body : null,
    query: req.query,
    params: req.params
  });

  // Convert known errors to AppError
  if (error.code && error.code.startsWith('23') || error.code === 'ECONNREFUSED') {
    appError = handleDatabaseError(error);
  } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError' || error.name === 'NotBeforeError') {
    appError = handleJWTError(error);
  } else if (error.isJoi) {
    appError = handleValidationError(error);
  } else if (error.code && error.code.startsWith('LIMIT_')) {
    appError = handleFileUploadError(error);
  } else if (error.statusCode === 429) {
    appError = handleRateLimitError(error);
  } else if (!(error instanceof AppError)) {
    // Unknown error
    appError = new AppError(
      process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
      500,
      false,
      {
        originalError: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    );
  }

  // Log the processed error
  logger.error('Processed error response', null, {
    statusCode: appError.statusCode,
    message: appError.message,
    isOperational: appError.isOperational,
    metadata: appError.metadata
  });

  // Send error response
  const errorResponse = {
    success: false,
    error: appError.message,
    statusCode: appError.statusCode,
    timestamp: appError.timestamp
  };

  // Add metadata in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.metadata = appError.metadata;
    errorResponse.stack = appError.stack;
  }

  // Add request ID if available
  if (req.requestId) {
    errorResponse.requestId = req.requestId;
  }

  res.status(appError.statusCode).json(errorResponse);
};

/**
 * Async error wrapper
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 handler
 */
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Generate unique request ID
  req.requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Log request start
  logger.info('Request started', {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user ? req.user.userId : null
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;
    logger.logRequest(req, res, duration);
    originalEnd.apply(this, args);
  };

  next();
};

module.exports = {
  AppError,
  errorHandler,
  asyncHandler,
  notFoundHandler,
  requestLogger,
  handleDatabaseError,
  handleJWTError,
  handleValidationError,
  handleFileUploadError,
  handleRateLimitError
};
