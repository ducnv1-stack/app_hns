const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate user via JWT token
 * Verifies token and attaches user info to req.user
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided. Please login to access this resource.'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      roles: decoded.roles || []
    };

    console.log('✅ Authentication successful:', {
      userId: req.user.userId,
      email: req.user.email,
      roles: req.user.roles
    });

    next();
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired. Please login again.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token. Please login again.'
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

/**
 * Middleware to authorize user based on roles
 * @param {Array<string>} allowedRoles - Array of role names that are allowed
 * @returns {Function} Express middleware function
 * 
 * Usage:
 *   router.post('/admin/tours', authenticate, authorize(['admin']), handler)
 *   router.get('/bookings', authenticate, authorize(['user', 'admin']), handler)
 */
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please login first.'
      });
    }

    // Check if user has required roles
    const userRoles = req.user.roles || [];
    const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      console.log('❌ Authorization failed:', {
        userId: req.user.userId,
        userRoles: userRoles,
        requiredRoles: allowedRoles
      });

      return res.status(403).json({
        success: false,
        error: 'Access denied. You do not have permission to access this resource.',
        requiredRoles: allowedRoles,
        yourRoles: userRoles
      });
    }

    console.log('✅ Authorization successful:', {
      userId: req.user.userId,
      roles: userRoles,
      requiredRoles: allowedRoles
    });

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 * Useful for endpoints that work differently for authenticated vs non-authenticated users
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token, continue without user info
      req.user = null;
      return next();
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      roles: decoded.roles || []
    };

    next();
  } catch (error) {
    // Invalid token, continue without user info
    req.user = null;
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth
};
