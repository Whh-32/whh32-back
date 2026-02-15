require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

// Import routes
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Node.js Auth API Documentation"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Welcome to Node.js Auth API
 *                 data:
 *                   type: object
 *                   properties:
 *                     documentation:
 *                       type: string
 *                       example: /api-docs
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Node.js Auth API',
    data: {
      documentation: '/api-docs',
      endpoints: {
        auth: '/api/auth',
        items: '/api/items'
      }
    }
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Server is running
 *                 data:
 *                   type: object
 *                   properties:
 *                     uptime:
 *                       type: number
 *                     timestamp:
 *                       type: string
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
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
║      GET  /api/items - Get all items                          ║
║      GET  /api/items/:id - Get item by ID                     ║
║      POST /api/items - Create new item                        ║
║                                                                ║
║   💡 Default Test Credentials:                                 ║
║      Username: admin                                          ║
║      Password: password123                                    ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
