const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const logger = require('../utils/logger');

/**
 * Authentication Service
 * Single Responsibility: Handle authentication logic
 * Dependency Inversion: Depends on abstractions (repository interface)
 */
class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Register new user
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async register(userData) {
    try {
      // Check if username exists
      const usernameExists = await this.userRepository.usernameExists(userData.username);
      if (usernameExists) {
        throw new Error('Username already exists');
      }

      // Check if email exists
      const emailExists = await this.userRepository.emailExists(userData.email);
      if (emailExists) {
        throw new Error('Email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await this.userRepository.create({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        first_name: userData.firstName || null,
        last_name: userData.lastName || null,
      });

      // Generate token
      const token = this.generateToken(user);

      logger.info(`User registered successfully: ${user.username}`);

      return {
        user,
        token,
      };
    } catch (error) {
      logger.error('Error in register service:', error);
      throw error;
    }
  }

  /**
   * Login user
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Object>}
   */
  async login(username, password) {
    try {
      // Find user by username
      const user = await this.userRepository.findByUsername(username);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await this.userRepository.updateLastLogin(user.id);

      // Remove password from user object
      delete user.password;

      // Generate token
      const token = this.generateToken(user);

      logger.info(`User logged in successfully: ${user.username}`);

      return {
        user,
        token,
      };
    } catch (error) {
      logger.error('Error in login service:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  async getUserProfile(userId) {
    try {
      const user = await this.userRepository.findByIdSafe(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      logger.error('Error in getUserProfile service:', error);
      throw error;
    }
  }

  /**
   * Generate JWT token
   * @param {Object} user
   * @returns {string}
   */
  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }

  /**
   * Verify JWT token
   * @param {string} token
   * @returns {Object}
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      logger.error('Error verifying token:', error);
      throw error;
    }
  }
}

module.exports = AuthService;
