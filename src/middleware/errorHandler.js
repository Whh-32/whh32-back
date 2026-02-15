const logger = require('../utils/logger');

/**
 * Error Handling Middleware
 * Centralized error handling
 */
const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // SQL Server specific errors
  if (err.code === 'ELOGIN') {
    return res.status(500).json({
      success: false,
      message: 'Database connection error',
    });
  }

  if (err.code === 'ETIMEOUT') {
    return res.status(504).json({
      success: false,
      message: 'Database query timeout',
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
