const logger = require('./logger');

/**
 * Error tracking và analytics utility
 */
class ErrorTracker {
  constructor() {
    this.errorStats = {
      totalErrors: 0,
      errorsByType: {},
      errorsByEndpoint: {},
      errorsByUser: {},
      recentErrors: []
    };
    
    this.startTime = new Date();
  }

  /**
   * Track error occurrence
   */
  trackError(error, context = {}) {
    const timestamp = new Date();
    const errorType = this.categorizeError(error);
    
    // Update stats
    this.errorStats.totalErrors++;
    
    // Count by type
    this.errorStats.errorsByType[errorType] = 
      (this.errorStats.errorsByType[errorType] || 0) + 1;
    
    // Count by endpoint
    if (context.endpoint) {
      this.errorStats.errorsByEndpoint[context.endpoint] = 
        (this.errorStats.errorsByEndpoint[context.endpoint] || 0) + 1;
    }
    
    // Count by user
    if (context.userId) {
      this.errorStats.errorsByUser[context.userId] = 
        (this.errorStats.errorsByUser[context.userId] || 0) + 1;
    }
    
    // Add to recent errors (keep last 100)
    const errorEntry = {
      timestamp,
      type: errorType,
      message: error.message,
      stack: error.stack,
      context: {
        endpoint: context.endpoint,
        userId: context.userId,
        method: context.method,
        ip: context.ip,
        userAgent: context.userAgent
      }
    };
    
    this.errorStats.recentErrors.unshift(errorEntry);
    if (this.errorStats.recentErrors.length > 100) {
      this.errorStats.recentErrors.pop();
    }
    
    // Log error tracking
    logger.info('Error tracked', {
      errorType,
      totalErrors: this.errorStats.totalErrors,
      context
    });
  }

  /**
   * Categorize error type
   */
  categorizeError(error) {
    if (error.code) {
      if (error.code.startsWith('23')) return 'DATABASE_ERROR';
      if (error.code === 'ECONNREFUSED') return 'CONNECTION_ERROR';
      if (error.code.startsWith('LIMIT_')) return 'FILE_UPLOAD_ERROR';
    }
    
    if (error.name) {
      if (error.name.includes('JWT') || error.name.includes('Token')) return 'AUTH_ERROR';
      if (error.name === 'ValidationError') return 'VALIDATION_ERROR';
      if (error.name === 'CastError') return 'DATA_TYPE_ERROR';
    }
    
    if (error.statusCode) {
      if (error.statusCode >= 500) return 'SERVER_ERROR';
      if (error.statusCode >= 400) return 'CLIENT_ERROR';
    }
    
    return 'UNKNOWN_ERROR';
  }

  /**
   * Get error statistics
   */
  getStats() {
    const uptime = Date.now() - this.startTime.getTime();
    
    return {
      ...this.errorStats,
      uptime: {
        milliseconds: uptime,
        seconds: Math.floor(uptime / 1000),
        minutes: Math.floor(uptime / (1000 * 60)),
        hours: Math.floor(uptime / (1000 * 60 * 60))
      },
      errorRate: {
        perMinute: this.errorStats.totalErrors / (uptime / (1000 * 60)),
        perHour: this.errorStats.totalErrors / (uptime / (1000 * 60 * 60))
      }
    };
  }

  /**
   * Get top error sources
   */
  getTopErrorSources(limit = 10) {
    const endpoints = Object.entries(this.errorStats.errorsByEndpoint)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit);
    
    const users = Object.entries(this.errorStats.errorsByUser)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit);
    
    const types = Object.entries(this.errorStats.errorsByType)
      .sort(([,a], [,b]) => b - a);
    
    return {
      topEndpoints: endpoints,
      topUsers: users,
      errorTypes: types
    };
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit = 20) {
    return this.errorStats.recentErrors.slice(0, limit);
  }

  /**
   * Generate error report
   */
  generateReport() {
    const stats = this.getStats();
    const sources = this.getTopErrorSources();
    const recent = this.getRecentErrors();
    
    const report = {
      summary: {
        totalErrors: stats.totalErrors,
        uptime: stats.uptime,
        errorRate: stats.errorRate
      },
      topSources: sources,
      recentErrors: recent,
      generatedAt: new Date().toISOString()
    };
    
    logger.info('Error report generated', {
      totalErrors: stats.totalErrors,
      errorTypes: Object.keys(stats.errorsByType).length,
      topEndpoint: sources.topEndpoints[0] || 'N/A'
    });
    
    return report;
  }

  /**
   * Reset statistics
   */
  reset() {
    this.errorStats = {
      totalErrors: 0,
      errorsByType: {},
      errorsByEndpoint: {},
      errorsByUser: {},
      recentErrors: []
    };
    this.startTime = new Date();
    
    logger.info('Error tracking statistics reset');
  }

  /**
   * Check if error rate is high
   */
  isErrorRateHigh(threshold = 10) { // 10 errors per minute
    const stats = this.getStats();
    return stats.errorRate.perMinute > threshold;
  }

  /**
   * Get alerts for high error rates
   */
  getAlerts() {
    const alerts = [];
    
    if (this.isErrorRateHigh()) {
      alerts.push({
        type: 'HIGH_ERROR_RATE',
        message: 'Error rate is above normal threshold',
        severity: 'WARNING',
        stats: this.getStats()
      });
    }
    
    // Check for specific error patterns
    const topErrors = this.getTopErrorSources();
    if (topErrors.topEndpoints.length > 0) {
      const [endpoint, count] = topErrors.topEndpoints[0];
      if (count > 5) {
        alerts.push({
          type: 'ENDPOINT_ERROR_SPIKE',
          message: `High error count on endpoint: ${endpoint}`,
          severity: 'WARNING',
          endpoint,
          count
        });
      }
    }
    
    return alerts;
  }
}

// Export singleton instance
const errorTracker = new ErrorTracker();
module.exports = errorTracker;
