const sql = require('mssql');
const BaseRepository = require('./BaseRepository');
const database = require('../config/database');
const logger = require('../utils/logger');

/**
 * User Repository
 * Extends BaseRepository with user-specific operations
 * Follows Open/Closed Principle - open for extension, closed for modification
 */
class UserRepository extends BaseRepository {
  constructor() {
    super('Users');
  }

  /**
   * Find user by username
   * @param {string} username
   * @returns {Promise<Object|null>}
   */
  async findByUsername(username) {
    return this.findByField('username', username);
  }

  /**
   * Find user by email
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    return this.findByField('email', email);
  }

  /**
   * Check if username exists
   * @param {string} username
   * @returns {Promise<boolean>}
   */
  async usernameExists(username) {
    try {
      const pool = await database.getPool();
      const result = await pool
        .request()
        .input('username', sql.NVarChar, username)
        .query('SELECT COUNT(*) as count FROM Users WHERE username = @username');

      return result.recordset[0].count > 0;
    } catch (error) {
      logger.error('Error in usernameExists:', error);
      throw error;
    }
  }

  /**
   * Check if email exists
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async emailExists(email) {
    try {
      const pool = await database.getPool();
      const result = await pool
        .request()
        .input('email', sql.NVarChar, email)
        .query('SELECT COUNT(*) as count FROM Users WHERE email = @email');

      return result.recordset[0].count > 0;
    } catch (error) {
      logger.error('Error in emailExists:', error);
      throw error;
    }
  }

  /**
   * Create user (override to exclude password from output)
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async create(userData) {
    try {
      const user = await super.create(userData);
      // Remove password from returned object
      delete user.password;
      return user;
    } catch (error) {
      logger.error('Error in create user:', error);
      throw error;
    }
  }

  /**
   * Update user last login
   * @param {number} userId
   * @returns {Promise<void>}
   */
  async updateLastLogin(userId) {
    try {
      const pool = await database.getPool();
      await pool
        .request()
        .input('userId', sql.Int, userId)
        .query('UPDATE Users SET last_login = GETDATE() WHERE id = @userId');
    } catch (error) {
      logger.error('Error in updateLastLogin:', error);
      throw error;
    }
  }

  /**
   * Get user with safe fields (without password)
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async findByIdSafe(id) {
    try {
      const pool = await database.getPool();
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query(`
          SELECT id, username, email, first_name, last_name, 
                 created_at, updated_at, last_login
          FROM Users 
          WHERE id = @id
        `);

      return result.recordset[0] || null;
    } catch (error) {
      logger.error('Error in findByIdSafe:', error);
      throw error;
    }
  }
}

module.exports = UserRepository;
