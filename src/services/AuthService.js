const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const logger = require('../utils/logger');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData) {
    try {
      const usernameExists = await this.userRepository.usernameExists(userData.username);
      if (usernameExists) {
        throw new Error('Username already exists');
      }

      const emailExists = await this.userRepository.emailExists(userData.email);
      if (emailExists) {
        throw new Error('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await this.userRepository.create({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        first_name: userData.firstName || null,
        last_name: userData.lastName || null,
      });

      const token = this.generateToken(user);

      logger.info(`User registered successfully: ${user.username}`);

      return { user, token };
    } catch (error) {
      logger.error('Error in register service:', error);
      throw error;
    }
  }

  async login(username, password) {
    try {
      const user = await this.userRepository.findByUsername(username);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      await this.userRepository.updateLastLogin(user.id);

      delete user.password;

      const token = this.generateToken(user);

      logger.info(`User logged in successfully: ${user.username}`);

      return { user, token };
    } catch (error) {
      logger.error('Error in login service:', error);
      throw error;
    }
  }

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
