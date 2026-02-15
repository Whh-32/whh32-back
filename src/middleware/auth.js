const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Authentication Middleware
 * Single Responsibility: Verify JWT tokens and attach user to request
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.',
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request
    req.user = decoded;
    
    logger.debug(`User authenticated: ${decoded.username}`);
    next();
  } catch (error) {
    logger.error('Authentication error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
    });
  }
};

module.exports = authMiddleware;
