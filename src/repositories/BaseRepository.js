const database = require('../config/database');
const logger = require('../utils/logger');

class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async findAll() {
    try {
      const query = `SELECT * FROM ${this.tableName}`;
      const result = await database.query(query);
      return result.rows;
    } catch (error) {
      logger.error(`Error in findAll (${this.tableName}):`, error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
      const result = await database.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error(`Error in findById (${this.tableName}):`, error);
      throw error;
    }
  }

  async findByField(field, value) {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE ${field} = $1`;
      const result = await database.query(query, [value]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error(`Error in findByField (${this.tableName}):`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
      const columns = keys.join(', ');

      const query = `
        INSERT INTO ${this.tableName} (${columns}) 
        VALUES (${placeholders})
        RETURNING *
      `;

      const result = await database.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error(`Error in create (${this.tableName}):`, error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      
      const setClause = keys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');

      const query = `
        UPDATE ${this.tableName} 
        SET ${setClause}, updated_at = NOW()
        WHERE id = $${keys.length + 1}
        RETURNING *
      `;

      const result = await database.query(query, [...values, id]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error(`Error in update (${this.tableName}):`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
      const result = await database.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      logger.error(`Error in delete (${this.tableName}):`, error);
      throw error;
    }
  }

  async count() {
    try {
      const query = `SELECT COUNT(*) as count FROM ${this.tableName}`;
      const result = await database.query(query);
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error(`Error in count (${this.tableName}):`, error);
      throw error;
    }
  }

  async exists(field, value) {
    try {
      const query = `SELECT EXISTS(SELECT 1 FROM ${this.tableName} WHERE ${field} = $1)`;
      const result = await database.query(query, [value]);
      return result.rows[0].exists;
    } catch (error) {
      logger.error(`Error in exists (${this.tableName}):`, error);
      throw error;
    }
  }
}

module.exports = BaseRepository;
