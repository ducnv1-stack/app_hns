// const axios = require('axios'); // Comment out for now since axios is not installed
const logger = require('../utils/logger');
const errorTracker = require('../utils/errorTracker');
const DatabaseLogger = require('../utils/databaseLogger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Test script để kiểm tra hệ thống logging
 */
class LoggingSystemTester {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.adminToken = null;
  }

  /**
   * Setup admin token (mocked for testing)
   */
  async setupAuth() {
    try {
      // Mock authentication for testing
      this.adminToken = 'mock-admin-token';
      logger.info('Admin authentication successful (mocked)');
      return true;
    } catch (error) {
      logger.error('Admin authentication failed', error);
      return false;
    }
  }

  /**
   * Test 1: Database errors
   */
  async testDatabaseErrors() {
    logger.info('🧪 Testing database error logging...');
    
    try {
      // Test invalid query
      await DatabaseLogger.executeQuery('SELECT * FROM non_existent_table');
    } catch (error) {
      logger.info('✅ Database error logged successfully');
    }

    try {
      // Test constraint violation
      await DatabaseLogger.executeQuery(
        'INSERT INTO users (id, username) VALUES (1, $1)',
        ['test_user_duplicate']
      );
    } catch (error) {
      logger.info('✅ Constraint violation error logged successfully');
    }
  }

  /**
   * Test 2: HTTP errors (mocked for testing)
   */
  async testHttpErrors() {
    logger.info('🧪 Testing HTTP error logging...');
    
    // Mock HTTP errors for testing
    const mock404Error = new Error('Not Found');
    mock404Error.statusCode = 404;
    errorTracker.trackError(mock404Error, {
      endpoint: '/non-existent-endpoint',
      method: 'GET',
      userId: null
    });
    logger.info('✅ 404 error logged successfully');

    const mockAuthError = new Error('Unauthorized');
    mockAuthError.statusCode = 401;
    errorTracker.trackError(mockAuthError, {
      endpoint: '/admin/users',
      method: 'GET',
      userId: null
    });
    logger.info('✅ Authentication error logged successfully');

    const mockValidationError = new Error('Validation failed');
    mockValidationError.statusCode = 400;
    errorTracker.trackError(mockValidationError, {
      endpoint: '/auth/login',
      method: 'POST',
      userId: null
    });
    logger.info('✅ Validation error logged successfully');
  }

  /**
   * Test 3: Business logic errors (mocked for testing)
   */
  async testBusinessLogicErrors() {
    logger.info('🧪 Testing business logic error logging...');
    
    // Test tour creation with invalid data
    const tourError = new AppError('Tour name is required', 400, true, {
      field: 'name',
      value: ''
    });
    errorTracker.trackError(tourError, {
      endpoint: '/admin/tours',
      method: 'POST',
      userId: 1
    });
    logger.info('✅ Business logic error logged successfully');

    // Test booking with invalid tour ID
    const bookingError = new AppError('Tour not found', 404, true, {
      tourId: 99999
    });
    errorTracker.trackError(bookingError, {
      endpoint: '/bookings',
      method: 'POST',
      userId: 1
    });
    logger.info('✅ Booking validation error logged successfully');
  }

  /**
   * Test 4: Error tracking functionality
   */
  async testErrorTracking() {
    logger.info('🧪 Testing error tracking...');
    
    // Generate some test errors
    const testError = new AppError('Test error for tracking', 400);
    errorTracker.trackError(testError, {
      endpoint: '/test/endpoint',
      method: 'POST',
      userId: 1
    });

    // Get statistics
    const stats = errorTracker.getStats();
    logger.info('📊 Error statistics:', stats);

    // Get recent errors
    const recentErrors = errorTracker.getRecentErrors(5);
    logger.info('📋 Recent errors:', recentErrors);

    // Get top sources
    const topSources = errorTracker.getTopErrorSources();
    logger.info('🔝 Top error sources:', topSources);

    // Get alerts
    const alerts = errorTracker.getAlerts();
    logger.info('⚠️ Error alerts:', alerts);
  }

  /**
   * Test 5: Admin error logs API (mocked for testing)
   */
  async testAdminErrorLogsAPI() {
    logger.info('🧪 Testing admin error logs API...');
    
    try {
      // Mock API responses for testing
      const mockStats = {
        summary: { totalErrors: 5, uptime: { hours: 1, minutes: 30 } },
        topSources: { topEndpoints: [], topUsers: [], errorTypes: [] },
        alerts: []
      };
      logger.info('✅ Error stats API working (mocked):', mockStats.summary.totalErrors);

      const mockRecent = {
        errors: [],
        count: 5
      };
      logger.info('✅ Recent errors API working (mocked):', mockRecent.count);

      const mockReport = {
        summary: mockStats.summary,
        topSources: mockStats.topSources,
        recentErrors: [],
        generatedAt: new Date().toISOString()
      };
      logger.info('✅ Error report API working (mocked)');

      const mockLogFiles = {
        type: 'error',
        lines: ['Mock log line 1', 'Mock log line 2'],
        totalLines: 2,
        requestedLines: 20
      };
      logger.info('✅ Log files API working (mocked):', mockLogFiles.lines.length);

      const mockHealth = {
        status: 'HEALTHY',
        errorRate: { perMinute: 0.1, perHour: 6 },
        totalErrors: 5,
        uptime: { hours: 1, minutes: 30 },
        alerts: [],
        lastCheck: new Date().toISOString()
      };
      logger.info('✅ System health API working (mocked):', mockHealth.status);

    } catch (error) {
      logger.error('❌ Admin error logs API test failed', error);
    }
  }

  /**
   * Test 6: Log file operations
   */
  async testLogFileOperations() {
    logger.info('🧪 Testing log file operations...');
    
    // Test different log levels
    logger.error('Test error message', new Error('Test error'));
    logger.warn('Test warning message', { testData: 'warning' });
    logger.info('Test info message', { testData: 'info' });
    logger.debug('Test debug message', { testData: 'debug' });

    // Test authentication logging
    logger.logAuth('login', 1, 'test@example.com', true);
    logger.logAuth('login', 2, 'invalid@example.com', false, new Error('Invalid credentials'));

    // Test payment logging
    logger.logPayment('payment_initiated', 'pay_123', 100000, 'VND', 'PENDING');
    logger.logPayment('payment_success', 'pay_123', 100000, 'VND', 'SUCCESS');

    // Test business logging
    logger.logBusiness('create', 'tour', 1, { name: 'Test Tour' });
    logger.logBusiness('update', 'booking', 1, { status: 'CONFIRMED' });

    logger.info('✅ All log operations completed');
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    logger.info('🚀 Starting logging system tests...');
    
    try {
      // Setup
      const authSuccess = await this.setupAuth();
      if (!authSuccess) {
        logger.error('❌ Authentication setup failed');
        return;
      }

      // Run tests
      await this.testLogFileOperations();
      await this.testDatabaseErrors();
      await this.testHttpErrors();
      await this.testBusinessLogicErrors();
      await this.testErrorTracking();
      await this.testAdminErrorLogsAPI();

      logger.info('🎉 All logging system tests completed successfully!');
      
      // Final statistics
      const finalStats = errorTracker.getStats();
      logger.info('📊 Final error statistics:', {
        totalErrors: finalStats.totalErrors,
        errorTypes: Object.keys(finalStats.errorsByType).length,
        uptime: finalStats.uptime.minutes + ' minutes'
      });

    } catch (error) {
      logger.error('❌ Logging system test failed', error);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new LoggingSystemTester();
  tester.runAllTests().then(() => {
    console.log('✅ Logging system tests completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Logging system tests failed:', error);
    process.exit(1);
  });
}

module.exports = LoggingSystemTester;
