const sql = require('mssql');
const BaseRepository = require('./BaseRepository');
const database = require('../config/database');
const logger = require('../utils/logger');

/**
 * Item Repository
 * Extends BaseRepository with item-specific operations
 */
class ItemRepository extends BaseRepository {
  constructor() {
    super('Items');
  }

  /**
   * Find items by user ID
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  async findByUserId(userId) {
    try {
      const pool = await database.getPool();
      const result = await pool
        .request()
        .input('userId', sql.Int, userId)
        .query('SELECT * FROM Items WHERE user_id = @userId ORDER BY created_at DESC');

      return result.recordset;
    } catch (error) {
      logger.error('Error in findByUserId:', error);
      throw error;
    }
  }

  /**
   * Find items by category
   * @param {string} category
   * @returns {Promise<Array>}
   */
  async findByCategory(category) {
    try {
      const pool = await database.getPool();
      const result = await pool
        .request()
        .input('category', sql.NVarChar, category)
        .query('SELECT * FROM Items WHERE category = @category ORDER BY created_at DESC');

      return result.recordset;
    } catch (error) {
      logger.error('Error in findByCategory:', error);
      throw error;
    }
  }

  /**
   * Search items by name
   * @param {string} searchTerm
   * @returns {Promise<Array>}
   */
  async searchByName(searchTerm) {
    try {
      const pool = await database.getPool();
      const result = await pool
        .request()
        .input('searchTerm', sql.NVarChar, `%${searchTerm}%`)
        .query('SELECT * FROM Items WHERE name LIKE @searchTerm ORDER BY created_at DESC');

      return result.recordset;
    } catch (error) {
      logger.error('Error in searchByName:', error);
      throw error;
    }
  }

  /**
   * Find item by ID and user ID (for authorization)
   * @param {number} id
   * @param {number} userId
   * @returns {Promise<Object|null>}
   */
  async findByIdAndUserId(id, userId) {
    try {
      const pool = await database.getPool();
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .input('userId', sql.Int, userId)
        .query('SELECT * FROM Items WHERE id = @id AND user_id = @userId');

      return result.recordset[0] || null;
    } catch (error) {
      logger.error('Error in findByIdAndUserId:', error);
      throw error;
    }
  }

  /**
   * Get items with pagination
   * @param {number} page
   * @param {number} limit
   * @returns {Promise<Object>}
   */
  async findWithPagination(page = 1, limit = 10) {
    try {
      const pool = await database.getPool();
      const offset = (page - 1) * limit;

      const result = await pool
        .request()
        .input('limit', sql.Int, limit)
        .input('offset', sql.Int, offset)
        .query(`
          SELECT * FROM Items 
          ORDER BY created_at DESC
          OFFSET @offset ROWS
          FETCH NEXT @limit ROWS ONLY
        `);

      const countResult = await pool.request().query('SELECT COUNT(*) as total FROM Items');

      return {
        items: result.recordset,
        pagination: {
          page,
          limit,
          total: countResult.recordset[0].total,
          totalPages: Math.ceil(countResult.recordset[0].total / limit),
        },
      };
    } catch (error) {
      logger.error('Error in findWithPagination:', error);
      throw error;
    }
  }
}

module.exports = ItemRepository;
