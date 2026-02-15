const express = require('express');
const router = express.Router();
const itemController = require('../controllers/ItemController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createItemSchema, updateItemSchema } = require('../validators/schemas');

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Item management endpoints
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items (with optional pagination and search)
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for item name
 *     responses:
 *       200:
 *         description: Items retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, itemController.getAllItems);

/**
 * @swagger
 * /api/items/my:
 *   get:
 *     summary: Get items created by current user
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User items retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/my', authMiddleware, itemController.getMyItems);

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get item by ID
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
 *       404:
 *         description: Item not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authMiddleware, itemController.getItemById);

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create new item
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
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop
 *               description:
 *                 type: string
 *                 example: High performance laptop
 *               price:
 *                 type: number
 *                 example: 999.99
 *               category:
 *                 type: string
 *                 example: Electronics
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, validate(createItemSchema), itemController.createItem);

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Update item
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       404:
 *         description: Item not found or unauthorized
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authMiddleware, validate(updateItemSchema), itemController.updateItem);

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete item
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
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found or unauthorized
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authMiddleware, itemController.deleteItem);

module.exports = router;
