const ItemService = require('../services/ItemService');
const logger = require('../utils/logger');

class ItemController {
  constructor() {
    this.itemService = new ItemService();
  }

  getAllItems = async (req, res, next) => {
    try {
      const { page, limit, search } = req.query;

      let items;

      if (page && limit) {
        const result = await this.itemService.getItemsWithPagination(
          parseInt(page),
          parseInt(limit)
        );
        return res.json({
          success: true,
          message: 'Items retrieved successfully',
          data: result,
        });
      } else if (search) {
        items = await this.itemService.searchItems(search);
      } else {
        items = await this.itemService.getAllItems();
      }

      res.json({
        success: true,
        message: 'Items retrieved successfully',
        data: { items, user: req.user },
      });
    } catch (error) {
      next(error);
    }
  };

  getMyItems = async (req, res, next) => {
    try {
      const items = await this.itemService.getItemsByUser(req.user.id);

      res.json({
        success: true,
        message: 'Your items retrieved successfully',
        data: { items },
      });
    } catch (error) {
      next(error);
    }
  };

  getItemById = async (req, res, next) => {
    try {
      const item = await this.itemService.getItemById(parseInt(req.params.id));

      res.json({
        success: true,
        message: 'Item retrieved successfully',
        data: { item },
      });
    } catch (error) {
      if (error.message === 'Item not found') {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      next(error);
    }
  };

  createItem = async (req, res, next) => {
    try {
      const item = await this.itemService.createItem(req.body, req.user.id);

      res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: { item },
      });
    } catch (error) {
      next(error);
    }
  };

  updateItem = async (req, res, next) => {
    try {
      const item = await this.itemService.updateItem(
        parseInt(req.params.id),
        req.body,
        req.user.id
      );

      res.json({
        success: true,
        message: 'Item updated successfully',
        data: { item },
      });
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('unauthorized')) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      next(error);
    }
  };

  deleteItem = async (req, res, next) => {
    try {
      await this.itemService.deleteItem(parseInt(req.params.id), req.user.id);

      res.json({
        success: true,
        message: 'Item deleted successfully',
        data: null,
      });
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('unauthorized')) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      next(error);
    }
  };
}

module.exports = new ItemController();
