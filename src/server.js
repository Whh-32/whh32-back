require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./common/config/swagger');
const prismaClient = require('./common/database/prisma.client');
const logger = require('./common/utils/logger');
const ErrorHandler = require('./common/errors/ErrorHandler');

const authRoutes = require('./features/auth/auth.routes');
const itemsRoutes = require('./features/items/items.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Node.js Auth API Documentation',
}));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome endpoint
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Welcome message
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Node.js Auth API with PostgreSQL and Prisma',
    data: {
      documentation: '/api-docs',
      endpoints: {
        auth: '/api/auth',
        items: '/api/items',
      },
      version: '2.0.0',
      architecture: 'Feature-based with SOLID principles',
    },
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
app.get('/health', async (req, res) => {
  try {
    const isHealthy = await prismaClient.healthCheck();

    if (!isHealthy) {
      return res.status(503).json({
        success: false,
        message: 'Service unavailable',
        data: {
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          database: 'disconnected',
        },
      });
    }

    res.json({
      success: true,
      message: 'Server is running',
      data: {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: 'connected',
      },
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service unavailable',
      data: {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: 'disconnected',
      },
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(ErrorHandler.handle);

const startServer = async () => {
  try {
    await prismaClient.connect();
    logger.info('Database connection established');

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🚀 Server is running on http://localhost:${PORT}              ║
║                                                                ║
║   📚 Swagger Documentation: http://localhost:${PORT}/api-docs   ║
║                                                                ║
║   🔐 Authentication Endpoints:                                 ║
║      POST /api/auth/register - Register new user              ║
║      POST /api/auth/login - Login user                        ║
║      GET  /api/auth/me - Get current user (Protected)         ║
║                                                                ║
║   📦 Items Endpoints (Protected):                              ║
║      GET    /api/items - Get all items                        ║
║      GET    /api/items/my - Get my items                      ║
║      GET    /api/items/:id - Get item by ID                   ║
║      POST   /api/items - Create new item                      ║
║      PUT    /api/items/:id - Update item                      ║
║      DELETE /api/items/:id - Delete item                      ║
║                                                                ║
║   💾 Database: PostgreSQL with Prisma                          ║
║                                                                ║
║   📝 Architecture: Feature-based with SOLID Principles         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
      `);

      logger.info(`Server started on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} signal received: closing HTTP server`);
  try {
    await prismaClient.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

startServer();

module.exports = app;
