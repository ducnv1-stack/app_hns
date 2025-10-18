const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middleware/auth');
const { asyncHandler } = require('../../middleware/errorHandler');
const errorTracker = require('../../utils/errorTracker');
const logger = require('../../utils/logger');
const fs = require('fs');
const path = require('path');

/**
 * Get error statistics
 * GET /api/admin/error-logs/stats
 */
router.get('/stats', authenticate, authorize(['admin']), asyncHandler(async (req, res) => {
  try {
    const stats = errorTracker.getStats();
    const topSources = errorTracker.getTopErrorSources();
    const alerts = errorTracker.getAlerts();
    
    logger.info('Error statistics requested', {
      userId: req.user.userId,
      totalErrors: stats.totalErrors
    });

    res.json({
      success: true,
      data: {
        summary: stats,
        topSources,
        alerts
      }
    });
  } catch (error) {
    logger.error('Failed to get error statistics', error, {
      userId: req.user.userId
    });
    throw error;
  }
}));

/**
 * Get recent errors
 * GET /api/admin/error-logs/recent
 */
router.get('/recent', authenticate, authorize(['admin']), asyncHandler(async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const recentErrors = errorTracker.getRecentErrors(limit);
    
    logger.info('Recent errors requested', {
      userId: req.user.userId,
      limit
    });

    res.json({
      success: true,
      data: {
        errors: recentErrors,
        count: recentErrors.length
      }
    });
  } catch (error) {
    logger.error('Failed to get recent errors', error, {
      userId: req.user.userId
    });
    throw error;
  }
}));

/**
 * Get error report
 * GET /api/admin/error-logs/report
 */
router.get('/report', authenticate, authorize(['admin']), asyncHandler(async (req, res) => {
  try {
    const report = errorTracker.generateReport();
    
    logger.info('Error report generated', {
      userId: req.user.userId,
      totalErrors: report.summary.totalErrors
    });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    logger.error('Failed to generate error report', error, {
      userId: req.user.userId
    });
    throw error;
  }
}));

/**
 * Get log files content
 * GET /api/admin/error-logs/files/:type
 */
router.get('/files/:type', authenticate, authorize(['admin']), asyncHandler(async (req, res) => {
  try {
    const { type } = req.params; // error, warn, info, debug
    const lines = parseInt(req.query.lines) || 100;
    
    const logFile = path.join(__dirname, '..', '..', 'logs', `${type}.log`);
    
    if (!fs.existsSync(logFile)) {
      return res.json({
        success: true,
        data: {
          type,
          lines: [],
          message: 'Log file not found or empty'
        }
      });
    }
    
    const content = fs.readFileSync(logFile, 'utf8');
    const logLines = content.split('\n').filter(line => line.trim());
    const recentLines = logLines.slice(-lines);
    
    logger.info('Log file content requested', {
      userId: req.user.userId,
      type,
      lines: recentLines.length
    });

    res.json({
      success: true,
      data: {
        type,
        lines: recentLines,
        totalLines: logLines.length,
        requestedLines: lines
      }
    });
  } catch (error) {
    logger.error('Failed to read log file', error, {
      userId: req.user.userId,
      type: req.params.type
    });
    throw error;
  }
}));

/**
 * Download log file
 * GET /api/admin/error-logs/download/:type
 */
router.get('/download/:type', authenticate, authorize(['admin']), asyncHandler(async (req, res) => {
  try {
    const { type } = req.params;
    const logFile = path.join(__dirname, '..', '..', 'logs', `${type}.log`);
    
    if (!fs.existsSync(logFile)) {
      return res.status(404).json({
        success: false,
        error: 'Log file not found'
      });
    }
    
    const filename = `hns-${type}-${new Date().toISOString().split('T')[0]}.log`;
    
    logger.info('Log file download requested', {
      userId: req.user.userId,
      type,
      filename
    });

    res.download(logFile, filename);
  } catch (error) {
    logger.error('Failed to download log file', error, {
      userId: req.user.userId,
      type: req.params.type
    });
    throw error;
  }
}));

/**
 * Reset error statistics
 * POST /api/admin/error-logs/reset
 */
router.post('/reset', authenticate, authorize(['admin']), asyncHandler(async (req, res) => {
  try {
    errorTracker.reset();
    
    logger.info('Error statistics reset', {
      userId: req.user.userId
    });

    res.json({
      success: true,
      message: 'Error statistics have been reset'
    });
  } catch (error) {
    logger.error('Failed to reset error statistics', error, {
      userId: req.user.userId
    });
    throw error;
  }
}));

/**
 * Get system health based on error rates
 * GET /api/admin/error-logs/health
 */
router.get('/health', authenticate, authorize(['admin']), asyncHandler(async (req, res) => {
  try {
    const stats = errorTracker.getStats();
    const alerts = errorTracker.getAlerts();
    const isHealthy = !errorTracker.isErrorRateHigh();
    
    const health = {
      status: isHealthy ? 'HEALTHY' : 'WARNING',
      errorRate: stats.errorRate,
      totalErrors: stats.totalErrors,
      uptime: stats.uptime,
      alerts: alerts,
      lastCheck: new Date().toISOString()
    };
    
    logger.info('System health check requested', {
      userId: req.user.userId,
      status: health.status,
      errorRate: health.errorRate.perMinute
    });

    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    logger.error('Failed to get system health', error, {
      userId: req.user.userId
    });
    throw error;
  }
}));

module.exports = router;
