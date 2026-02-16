const logger = require('../utils/logger');
const AppError = require('./AppError');

class ErrorHandler {
  static handle(err, req, res, next) {
    logger.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });

    // Prisma errors
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Duplicate entry. This record already exists.',
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Record not found.',
      });
    }

    // Database connection errors
    if (err.code === 'ECONNREFUSED' || err.code === 'P1001' || err.code === 'P1000') {
      logger.error('Database connection error details:', {
        code: err.code,
        message: err.message,
      });
      return res.status(500).json({
        success: false,
        message: 'Database connection error',
        ...(process.env.NODE_ENV === 'development' && {
          details: err.message,
          code: err.code,
        }),
      });
    }

    // Prisma connection pool errors
    if (err.message && err.message.includes('connect ECONNREFUSED')) {
      return res.status(500).json({
        success: false,
        message: 'Database connection error',
        ...(process.env.NODE_ENV === 'development' && {
          details: 'Cannot connect to database. Please check if PostgreSQL is running and DATABASE_URL is correct.',
        }),
      });
    }

    // Validation errors
    if (err.name === 'ValidationError' || err.isJoi) {
      return res.status(400).json({
        success: false,
        message: err.message,
        details: err.details,
      });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired.',
      });
    }

    // AppError (operational errors)
    if (err instanceof AppError && err.isOperational) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }

    // Default error
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }
}

module.exports = ErrorHandler;
