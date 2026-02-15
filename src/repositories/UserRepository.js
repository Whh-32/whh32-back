const BaseRepository = require('./BaseRepository');
const database = require('../config/database');
const logger = require('../utils/logger');

class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  async findByUsername(username) {
    return this.findByField('username', username);
  }

  async findByEmail(email) {
    return this.findByField('email', email);
  }

  async usernameExists(username) {
    return this.exists('username', username);
  }

  async emailExists(email) {
    return this.exists('email', email);
  }

  async create(userData) {
    try {
      const user = await super.create(userData);
      delete user.password;
      return user;
    } catch (error) {
      logger.error('Error in create user:', error);
      throw error;
    }
  }

  async updateLastLogin(userId) {
    try {
      const query = 'UPDATE users SET last_login = NOW() WHERE id = $1';
      await database.query(query, [userId]);
    } catch (error) {
      logger.error('Error in updateLastLogin:', error);
      throw error;
    }
  }

  async findByIdSafe(id) {
    try {
      const query = `
        SELECT id, username, email, first_name, last_name, 
               created_at, updated_at, last_login
        FROM users 
        WHERE id = $1
      `;
      const result = await database.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error in findByIdSafe:', error);
      throw error;
    }
  }
}

module.exports = UserRepository;
