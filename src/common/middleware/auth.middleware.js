const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const AppError = require('../errors/AppError');

class AuthMiddleware {
  static authenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('No token provided. Authorization denied.', 401);
      }

      const token = authHeader.split(' ')[1];

      if (!token) {
        throw new AppError('Invalid token format.', 401);
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      
      logger.debug(`User authenticated: ${decoded.username}`);
      next();
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }

      logger.error('Authentication error:', error);

      if (error.name === 'JsonWebTokenError') {
        return next(new AppError('Invalid token.', 401));
      }

      if (error.name === 'TokenExpiredError') {
        return next(new AppError('Token has expired.', 401));
      }

      return next(new AppError('Server error during authentication.', 500));
    }
  }
}

module.exports = AuthMiddleware;
