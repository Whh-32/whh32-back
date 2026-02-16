const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const logger = require('../utils/logger');

class PrismaClientSingleton {
    constructor() {
        if (PrismaClientSingleton.instance) {
            return PrismaClientSingleton.instance;
        }

        // Prisma 7: Create PostgreSQL pool and adapter
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            logger.error('DATABASE_URL environment variable is not set');
            throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
        }

        // Validate connection string format
        if (!connectionString.startsWith('postgresql://') && !connectionString.startsWith('postgres://')) {
            logger.error('Invalid DATABASE_URL format:', connectionString.substring(0, 50) + '...');
            throw new Error('DATABASE_URL must start with postgresql:// or postgres://');
        }

        logger.debug('Initializing Prisma Client with connection string:', connectionString.replace(/:[^:@]+@/, ':****@'));

        const pool = new Pool({
            connectionString,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        // Handle pool errors
        pool.on('error', (err) => {
            logger.error('PostgreSQL pool error:', err);
        });

        const adapter = new PrismaPg(pool);

        // Only configure log if in development
        const logConfig = process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'];

        this.prisma = new PrismaClient({
            adapter,
            log: logConfig,
        });

        this.pool = pool;

        PrismaClientSingleton.instance = this;
    }

    getClient() {
        return this.prisma;
    }

    async connect() {
        try {
            await this.prisma.$connect();
            logger.info('Prisma Client connected to database');
        } catch (error) {
            logger.error('Failed to connect Prisma Client:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            await this.prisma.$disconnect();
            if (this.pool) {
                await this.pool.end();
            }
            logger.info('Prisma Client disconnected from database');
        } catch (error) {
            logger.error('Error disconnecting Prisma Client:', error);
            throw error;
        }
    }

    async healthCheck() {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            return true;
        } catch (error) {
            logger.error('Database health check failed:', error);
            return false;
        }
    }
}

module.exports = new PrismaClientSingleton();
