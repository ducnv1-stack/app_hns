const fs = require('fs');
const path = require('path');

// Tạo thư mục logs nếu chưa tồn tại
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Định nghĩa log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Current log level (có thể config từ environment)
const CURRENT_LOG_LEVEL = process.env.LOG_LEVEL || 'INFO';

/**
 * Utility class để handle logging
 */
class Logger {
  constructor() {
    this.logLevel = LOG_LEVELS[CURRENT_LOG_LEVEL] || LOG_LEVELS.INFO;
  }

  /**
   * Format log message với timestamp và metadata
   */
  formatMessage(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...metadata
    };
    
    return JSON.stringify(logEntry, null, 2);
  }

  /**
   * Write log to file
   */
  writeToFile(filename, content) {
    const logFile = path.join(logsDir, filename);
    fs.appendFileSync(logFile, content + '\n');
  }

  /**
   * Write log to console với colors
   */
  writeToConsole(level, message, metadata = {}) {
    const colors = {
      ERROR: '\x1b[31m', // Red
      WARN: '\x1b[33m',  // Yellow
      INFO: '\x1b[36m',  // Cyan
      DEBUG: '\x1b[37m'  // White
    };
    
    const resetColor = '\x1b[0m';
    const color = colors[level] || '';
    
    console.log(`${color}[${level}]${resetColor} ${message}`, metadata);
  }

  /**
   * Log error với stack trace
   */
  error(message, error = null, metadata = {}) {
    if (this.logLevel >= LOG_LEVELS.ERROR) {
      const errorData = {
        ...metadata,
        stack: error ? error.stack : null,
        errorMessage: error ? error.message : null,
        errorName: error ? error.name : null
      };
      
      const formattedMessage = this.formatMessage('ERROR', message, errorData);
      
      // Console output
      this.writeToConsole('ERROR', message, errorData);
      
      // File output
      this.writeToFile('error.log', formattedMessage);
    }
  }

  /**
   * Log warning
   */
  warn(message, metadata = {}) {
    if (this.logLevel >= LOG_LEVELS.WARN) {
      const formattedMessage = this.formatMessage('WARN', message, metadata);
      
      this.writeToConsole('WARN', message, metadata);
      this.writeToFile('warn.log', formattedMessage);
    }
  }

  /**
   * Log info
   */
  info(message, metadata = {}) {
    if (this.logLevel >= LOG_LEVELS.INFO) {
      const formattedMessage = this.formatMessage('INFO', message, metadata);
      
      this.writeToConsole('INFO', message, metadata);
      this.writeToFile('info.log', formattedMessage);
    }
  }

  /**
   * Log debug
   */
  debug(message, metadata = {}) {
    if (this.logLevel >= LOG_LEVELS.DEBUG) {
      const formattedMessage = this.formatMessage('DEBUG', message, metadata);
      
      this.writeToConsole('DEBUG', message, metadata);
      this.writeToFile('debug.log', formattedMessage);
    }
  }

  /**
   * Log HTTP request
   */
  logRequest(req, res, responseTime) {
    const requestData = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user ? req.user.userId : null,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    };

    if (res.statusCode >= 400) {
      this.error(`HTTP ${res.statusCode}`, null, requestData);
    } else if (res.statusCode >= 300) {
      this.warn(`HTTP ${res.statusCode}`, requestData);
    } else {
      this.info(`HTTP ${res.statusCode}`, requestData);
    }
  }

  /**
   * Log database query
   */
  logQuery(query, params, duration, error = null) {
    const queryData = {
      query: query.replace(/\s+/g, ' ').trim(),
      params,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    };

    if (error) {
      this.error('Database query failed', error, queryData);
    } else {
      this.debug('Database query executed', queryData);
    }
  }

  /**
   * Log authentication events
   */
  logAuth(action, userId, email, success, error = null) {
    const authData = {
      action, // login, logout, register, token_refresh
      userId,
      email,
      success,
      timestamp: new Date().toISOString()
    };

    if (error) {
      this.error(`Auth ${action} failed`, error, authData);
    } else {
      this.info(`Auth ${action} ${success ? 'successful' : 'failed'}`, authData);
    }
  }

  /**
   * Log payment events
   */
  logPayment(action, paymentId, amount, currency, status, error = null) {
    const paymentData = {
      action, // payment_initiated, payment_success, payment_failed, refund
      paymentId,
      amount,
      currency,
      status,
      timestamp: new Date().toISOString()
    };

    if (error) {
      this.error(`Payment ${action} failed`, error, paymentData);
    } else {
      this.info(`Payment ${action}`, paymentData);
    }
  }

  /**
   * Log business logic events
   */
  logBusiness(action, entity, entityId, metadata = {}, error = null) {
    const businessData = {
      action, // create, update, delete, view
      entity, // tour, booking, user, payment
      entityId,
      ...metadata,
      timestamp: new Date().toISOString()
    };

    if (error) {
      this.error(`Business ${action} failed`, error, businessData);
    } else {
      this.info(`Business ${action}`, businessData);
    }
  }
}

// Export singleton instance
const logger = new Logger();
module.exports = logger;
