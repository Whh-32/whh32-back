const AuthService = require('../services/AuthService');
const logger = require('../utils/logger');

/**
 * Authentication Controller
 * Single Responsibility: Handle HTTP requests/responses for auth
 * Depends on AuthService for business logic
 */
class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register new user
   */
  register = async (req, res, next) => {
    try {
      const result = await this.authService.register(req.body);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      if (error.message.includes('already exists')) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      next(error);
    }
  };

  /**
   * Login user
   */
  login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const result = await this.authService.login(username, password);

      res.json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      }
      next(error);
    }
  };

  /**
   * Get current user profile
   */
  getProfile = async (req, res, next) => {
    try {
      const user = await this.authService.getUserProfile(req.user.id);

      res.json({
        success: true,
        message: 'User profile retrieved successfully',
        data: { user },
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      next(error);
    }
  };
}

module.exports = new AuthController();
