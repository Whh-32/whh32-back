const sql = require('mssql');
const logger = require('../utils/logger');

/**
 * Database Configuration - Singleton Pattern
 * Ensures single database connection pool throughout the application
 */
class Database {
  constructor() {
    this.pool = null;
    this.config = {
      server: process.env.DB_SERVER,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true,
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
    };
  }

  /**
   * Get database connection pool
   * @returns {Promise<sql.ConnectionPool>}
   */
  async getPool() {
    if (!this.pool) {
      try {
        this.pool = await sql.connect(this.config);
        logger.info('Database connection pool created successfully');
      } catch (error) {
        logger.error('Error creating database connection pool:', error);
        throw error;
      }
    }
    return this.pool;
  }

  /**
   * Execute query with parameters
   * @param {string} query - SQL query
   * @param {Object} params - Query parameters
   * @returns {Promise<sql.IResult>}
   */
  async query(query, params = {}) {
    try {
      const pool = await this.getPool();
      const request = pool.request();

      // Add parameters to request
      Object.keys(params).forEach((key) => {
        request.input(key, params[key]);
      });

      return await request.query(query);
    } catch (error) {
      logger.error('Database query error:', error);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async close() {
    try {
      if (this.pool) {
        await this.pool.close();
        this.pool = null;
        logger.info('Database connection closed');
      }
    } catch (error) {
      logger.error('Error closing database connection:', error);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new Database();
