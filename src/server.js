require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const database = require('./config/database');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth.routes');
const itemRoutes = require('./routes/item.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Swagger Documentation
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
    message: 'Welcome to Node.js Auth API with SQL Server',
    data: {
      documentation: '/api-docs',
      endpoints: {
        auth: '/api/auth',
        items: '/api/items',
      },
      version: '1.0.0',
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
    // Check database connection
    await database.getPool();
    
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
app.use('/api/items', itemRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await database.getPool();
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
║   💾 Database: SQL Server (${process.env.DB_DATABASE})                         ║
║                                                                ║
║   📝 Architecture: SOLID Principles                            ║
║      - Single Responsibility Principle                        ║
║      - Open/Closed Principle                                  ║
║      - Liskov Substitution Principle                          ║
║      - Interface Segregation Principle                        ║
║      - Dependency Inversion Principle                         ║
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

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await database.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await database.close();
  process.exit(0);
});

startServer();

module.exports = app;
