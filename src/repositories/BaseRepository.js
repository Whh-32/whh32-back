const sql = require('mssql');
const database = require('../config/database');
const logger = require('../utils/logger');

/**
 * Base Repository
 * Implements common CRUD operations following Repository Pattern
 * Promotes DRY (Don't Repeat Yourself) principle
 */
class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * Find all records
   * @returns {Promise<Array>}
   */
  async findAll() {
    try {
      const query = `SELECT * FROM ${this.tableName}`;
      const result = await database.query(query);
      return result.recordset;
    } catch (error) {
      logger.error(`Error in findAll (${this.tableName}):`, error);
      throw error;
    }
  }

  /**
   * Find record by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    try {
      const pool = await database.getPool();
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query(`SELECT * FROM ${this.tableName} WHERE id = @id`);

      return result.recordset[0] || null;
    } catch (error) {
      logger.error(`Error in findById (${this.tableName}):`, error);
      throw error;
    }
  }

  /**
   * Find record by field
   * @param {string} field - Field name
   * @param {*} value - Field value
   * @returns {Promise<Object|null>}
   */
  async findByField(field, value) {
    try {
      const pool = await database.getPool();
      const result = await pool
        .request()
        .input('value', value)
        .query(`SELECT * FROM ${this.tableName} WHERE ${field} = @value`);

      return result.recordset[0] || null;
    } catch (error) {
      logger.error(`Error in findByField (${this.tableName}):`, error);
      throw error;
    }
  }

  /**
   * Create new record
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    try {
      const pool = await database.getPool();
      const request = pool.request();

      const columns = Object.keys(data).join(', ');
      const values = Object.keys(data)
        .map((key) => `@${key}`)
        .join(', ');

      Object.keys(data).forEach((key) => {
        request.input(key, data[key]);
      });

      const query = `
        INSERT INTO ${this.tableName} (${columns}) 
        OUTPUT INSERTED.*
        VALUES (${values})
      `;

      const result = await request.query(query);
      return result.recordset[0];
    } catch (error) {
      logger.error(`Error in create (${this.tableName}):`, error);
      throw error;
    }
  }

  /**
   * Update record by ID
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object|null>}
   */
  async update(id, data) {
    try {
      const pool = await database.getPool();
      const request = pool.request();

      const setClause = Object.keys(data)
        .map((key) => `${key} = @${key}`)
        .join(', ');

      request.input('id', sql.Int, id);
      Object.keys(data).forEach((key) => {
        request.input(key, data[key]);
      });

      const query = `
        UPDATE ${this.tableName} 
        SET ${setClause}, updated_at = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `;

      const result = await request.query(query);
      return result.recordset[0] || null;
    } catch (error) {
      logger.error(`Error in update (${this.tableName}):`, error);
      throw error;
    }
  }

  /**
   * Delete record by ID
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      const pool = await database.getPool();
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query(`DELETE FROM ${this.tableName} WHERE id = @id`);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      logger.error(`Error in delete (${this.tableName}):`, error);
      throw error;
    }
  }

  /**
   * Count records
   * @returns {Promise<number>}
   */
  async count() {
    try {
      const query = `SELECT COUNT(*) as total FROM ${this.tableName}`;
      const result = await database.query(query);
      return result.recordset[0].total;
    } catch (error) {
      logger.error(`Error in count (${this.tableName}):`, error);
      throw error;
    }
  }
}

module.exports = BaseRepository;
