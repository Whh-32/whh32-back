const BaseRepository = require('./BaseRepository');
const database = require('../config/database');
const logger = require('../utils/logger');

class ItemRepository extends BaseRepository {
  constructor() {
    super('items');
  }

  async findByUserId(userId) {
    try {
      const query = 'SELECT * FROM items WHERE user_id = $1 ORDER BY created_at DESC';
      const result = await database.query(query, [userId]);
      return result.rows;
    } catch (error) {
      logger.error('Error in findByUserId:', error);
      throw error;
    }
  }

  async findByCategory(category) {
    try {
      const query = 'SELECT * FROM items WHERE category = $1 ORDER BY created_at DESC';
      const result = await database.query(query, [category]);
      return result.rows;
    } catch (error) {
      logger.error('Error in findByCategory:', error);
      throw error;
    }
  }

  async searchByName(searchTerm) {
    try {
      const query = 'SELECT * FROM items WHERE name ILIKE $1 ORDER BY created_at DESC';
      const result = await database.query(query, [`%${searchTerm}%`]);
      return result.rows;
    } catch (error) {
      logger.error('Error in searchByName:', error);
      throw error;
    }
  }

  async findByIdAndUserId(id, userId) {
    try {
      const query = 'SELECT * FROM items WHERE id = $1 AND user_id = $2';
      const result = await database.query(query, [id, userId]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error in findByIdAndUserId:', error);
      throw error;
    }
  }

  async findWithPagination(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const itemsQuery = `
        SELECT * FROM items 
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      const itemsResult = await database.query(itemsQuery, [limit, offset]);

      const countQuery = 'SELECT COUNT(*) as count FROM items';
      const countResult = await database.query(countQuery);
      const total = parseInt(countResult.rows[0].count);

      return {
        items: itemsResult.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error in findWithPagination:', error);
      throw error;
    }
  }
}

module.exports = ItemRepository;
