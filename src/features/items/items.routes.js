const express = require('express');
const router = express.Router();
const itemsController = require('./items.controller');
const AuthMiddleware = require('../../common/middleware/auth.middleware');
const ValidateMiddleware = require('../../common/middleware/validate.middleware');
const { createItemSchema, updateItemSchema } = require('./items.validator');

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
 *     summary: Get all items
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Items retrieved successfully
 */
router.get('/', AuthMiddleware.authenticate, itemsController.getAllItems);

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
 */
router.get('/my', AuthMiddleware.authenticate, itemsController.getMyItems);

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
 *     responses:
 *       200:
 *         description: Item retrieved successfully
 */
router.get('/:id', AuthMiddleware.authenticate, itemsController.getItemById);

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
 *               price:
 *                 type: number
 *                 example: 999.99
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item created successfully
 */
router.post('/', AuthMiddleware.authenticate, ValidateMiddleware.validate(createItemSchema), itemsController.createItem);

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Item updated successfully
 */
router.put('/:id', AuthMiddleware.authenticate, ValidateMiddleware.validate(updateItemSchema), itemsController.updateItem);

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
 *     responses:
 *       200:
 *         description: Item deleted successfully
 */
router.delete('/:id', AuthMiddleware.authenticate, itemsController.deleteItem);

module.exports = router;
