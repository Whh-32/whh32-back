const { Pool } = require('pg');
const logger = require('../utils/logger');

class Database {
  constructor() {
    this.pool = null;
    this.config = {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      max: parseInt(process.env.DB_POOL_MAX) || 10,
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE) || 10000,
    };
  }

  getPool() {
    if (!this.pool) {
      try {
        this.pool = new Pool(this.config);
        
        this.pool.on('connect', () => {
          logger.debug('New database connection established');
        });

        this.pool.on('error', (err) => {
          logger.error('Unexpected error on idle client', err);
        });

        logger.info('Database connection pool created successfully');
      } catch (error) {
        logger.error('Error creating database connection pool:', error);
        throw error;
      }
    }
    return this.pool;
  }

  async query(text, params = []) {
    try {
      const pool = this.getPool();
      const start = Date.now();
      const result = await pool.query(text, params);
      const duration = Date.now() - start;
      
      logger.debug('Executed query', { text, duration, rows: result.rowCount });
      
      return result;
    } catch (error) {
      logger.error('Database query error:', error);
      throw error;
    }
  }

  async getClient() {
    try {
      const pool = this.getPool();
      return await pool.connect();
    } catch (error) {
      logger.error('Error getting database client:', error);
      throw error;
    }
  }

  async close() {
    try {
      if (this.pool) {
        await this.pool.end();
        this.pool = null;
        logger.info('Database connection pool closed');
      }
    } catch (error) {
      logger.error('Error closing database connection:', error);
      throw error;
    }
  }
}

module.exports = new Database();
