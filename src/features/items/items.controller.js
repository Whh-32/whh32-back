const ItemsService = require('./items.service');
const logger = require('../../common/utils/logger');

class ItemsController {
  constructor() {
    this.itemsService = new ItemsService();
  }

  getAllItems = async (req, res, next) => {
    try {
      const { page, limit, search } = req.query;

      let items;

      if (page && limit) {
        const result = await this.itemsService.getItemsWithPagination(
          parseInt(page),
          parseInt(limit)
        );
        return res.json({
          success: true,
          message: 'Items retrieved successfully',
          data: result,
        });
      } else if (search) {
        items = await this.itemsService.searchItems(search);
      } else {
        items = await this.itemsService.getAllItems();
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
      const items = await this.itemsService.getItemsByUser(req.user.id);

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
      const item = await this.itemsService.getItemById(parseInt(req.params.id));

      res.json({
        success: true,
        message: 'Item retrieved successfully',
        data: { item },
      });
    } catch (error) {
      next(error);
    }
  };

  createItem = async (req, res, next) => {
    try {
      const item = await this.itemsService.createItem(req.body, req.user.id);

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
      const item = await this.itemsService.updateItem(
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
      next(error);
    }
  };

  deleteItem = async (req, res, next) => {
    try {
      await this.itemsService.deleteItem(parseInt(req.params.id), req.user.id);

      res.json({
        success: true,
        message: 'Item deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new ItemsController();
