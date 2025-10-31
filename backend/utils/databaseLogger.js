const { query } = require('../config/database-supabase');
const logger = require('./logger');

/**
 * Enhanced database query wrapper với logging
 */
class DatabaseLogger {
  /**
   * Execute query với logging
   */
  static async executeQuery(queryText, params = [], context = {}) {
    const start = Date.now();
    
    try {
      logger.debug('Executing database query', {
        query: queryText.replace(/\s+/g, ' ').trim(),
        params,
        context
      });

      const result = await query(queryText, params);
      const duration = Date.now() - start;

      // Log successful query
      logger.logQuery(queryText, params, duration);

      return result;
    } catch (error) {
      const duration = Date.now() - start;
      
      // Log failed query với chi tiết lỗi
      logger.error('Database query failed', error, {
        query: queryText.replace(/\s+/g, ' ').trim(),
        params,
        duration: `${duration}ms`,
        context,
        errorCode: error.code,
        errorDetail: error.detail,
        errorHint: error.hint
      });

      throw error;
    }
  }

  /**
   * Execute transaction với logging
   */
  static async executeTransaction(queries, context = {}) {
    const { getClient } = require('../config/database-supabase');
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      logger.info('Database transaction started', {
        queryCount: queries.length,
        context
      });

      const results = [];
      const start = Date.now();

      for (const { query: queryText, params = [] } of queries) {
        const queryStart = Date.now();
        
        logger.debug('Executing transaction query', {
          query: queryText.replace(/\s+/g, ' ').trim(),
          params,
          context
        });

        const result = await client.query(queryText, params);
        const queryDuration = Date.now() - queryStart;
        
        logger.logQuery(queryText, params, queryDuration);
        results.push(result);
      }

      await client.query('COMMIT');
      const totalDuration = Date.now() - start;

      logger.info('Database transaction completed successfully', {
        queryCount: queries.length,
        duration: `${totalDuration}ms`,
        context
      });

      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      const duration = Date.now() - start;

      logger.error('Database transaction failed - rolled back', error, {
        queryCount: queries.length,
        duration: `${duration}ms`,
        context,
        errorCode: error.code
      });

      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Execute query với retry logic
   */
  static async executeWithRetry(queryText, params = [], maxRetries = 3, context = {}) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logger.debug(`Database query attempt ${attempt}/${maxRetries}`, {
          query: queryText.replace(/\s+/g, ' ').trim(),
          params,
          context
        });

        const result = await this.executeQuery(queryText, params, context);
        
        if (attempt > 1) {
          logger.info(`Database query succeeded on attempt ${attempt}`, {
            query: queryText.replace(/\s+/g, ' ').trim(),
            context
          });
        }
        
        return result;
      } catch (error) {
        lastError = error;
        
        logger.warn(`Database query attempt ${attempt} failed`, {
          query: queryText.replace(/\s+/g, ' ').trim(),
          error: error.message,
          errorCode: error.code,
          context
        });

        // Don't retry for certain error types
        if (error.code === '23505' || error.code === '23503' || error.code === '23502') {
          throw error;
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    logger.error('Database query failed after all retries', lastError, {
      query: queryText.replace(/\s+/g, ' ').trim(),
      maxRetries,
      context
    });

    throw lastError;
  }

  /**
   * Log database connection events
   */
  static logConnection(event, details = {}) {
    switch (event) {
      case 'connect':
        logger.info('Database connection established', details);
        break;
      case 'error':
        logger.error('Database connection error', null, details);
        break;
      case 'disconnect':
        logger.info('Database connection closed', details);
        break;
      case 'pool_created':
        logger.info('Database connection pool created', details);
        break;
      case 'pool_acquired':
        logger.debug('Database connection acquired from pool', details);
        break;
      case 'pool_released':
        logger.debug('Database connection released to pool', details);
        break;
      default:
        logger.info(`Database connection event: ${event}`, details);
    }
  }
}

module.exports = DatabaseLogger;
