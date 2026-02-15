const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Sample data
const items = [
  { id: 1, name: 'Item 1', description: 'First item', price: 100 },
  { id: 2, name: 'Item 2', description: 'Second item', price: 200 },
  { id: 3, name: 'Item 3', description: 'Third item', price: 300 }
];

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items (Protected)
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Items retrieved successfully
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
 *                   example: Items retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           price:
 *                             type: number
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Items retrieved successfully',
    data: {
      items,
      user: req.user
    }
  });
});

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get item by ID (Protected)
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item retrieved successfully
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     item:
 *                       type: object
 *       404:
 *         description: Item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', authMiddleware, (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  res.json({
    success: true,
    message: 'Item retrieved successfully',
    data: {
      item
    }
  });
});

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create new item (Protected)
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: New Item
 *               description:
 *                 type: string
 *                 example: Description of new item
 *               price:
 *                 type: number
 *                 example: 150
 *     responses:
 *       201:
 *         description: Item created successfully
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
 *                 data:
 *                   type: object
 */
router.post('/', authMiddleware, (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, description, and price'
    });
  }

  const newItem = {
    id: items.length + 1,
    name,
    description,
    price: parseFloat(price)
  };

  items.push(newItem);

  res.status(201).json({
    success: true,
    message: 'Item created successfully',
    data: {
      item: newItem
    }
  });
});

module.exports = router;
