const ItemsRepository = require('./items.repository');
const logger = require('../../common/utils/logger');
const AppError = require('../../common/errors/AppError');

class ItemsService {
  constructor() {
    this.itemsRepository = new ItemsRepository();
  }

  async getAllItems() {
    try {
      return await this.itemsRepository.findAll();
    } catch (error) {
      logger.error('Error in getAllItems service:', error);
      throw error;
    }
  }

  async getItemsByUser(userId) {
    try {
      return await this.itemsRepository.findByUserId(userId);
    } catch (error) {
      logger.error('Error in getItemsByUser service:', error);
      throw error;
    }
  }

  async getItemById(id) {
    try {
      const item = await this.itemsRepository.findById(id);
      if (!item) {
        throw new AppError('Item not found', 404);
      }
      return item;
    } catch (error) {
      logger.error('Error in getItemById service:', error);
      throw error;
    }
  }

  async createItem(itemData, userId) {
    try {
      const item = await this.itemsRepository.create({
        name: itemData.name,
        description: itemData.description || null,
        price: itemData.price,
        category: itemData.category || null,
        userId,
      });

      logger.info(`Item created successfully by user ${userId}: ${item.name}`);
      return item;
    } catch (error) {
      logger.error('Error in createItem service:', error);
      throw error;
    }
  }

  async updateItem(id, itemData, userId) {
    try {
      const existingItem = await this.itemsRepository.findByIdAndUserId(id, userId);
      if (!existingItem) {
        throw new AppError('Item not found or unauthorized', 404);
      }

      const updatedItem = await this.itemsRepository.update(id, itemData);
      
      logger.info(`Item updated successfully by user ${userId}: ${updatedItem.name}`);
      return updatedItem;
    } catch (error) {
      logger.error('Error in updateItem service:', error);
      throw error;
    }
  }

  async deleteItem(id, userId) {
    try {
      const existingItem = await this.itemsRepository.findByIdAndUserId(id, userId);
      if (!existingItem) {
        throw new AppError('Item not found or unauthorized', 404);
      }

      await this.itemsRepository.delete(id);
      
      logger.info(`Item deleted successfully by user ${userId}`);
      return true;
    } catch (error) {
      logger.error('Error in deleteItem service:', error);
      throw error;
    }
  }

  async searchItems(searchTerm) {
    try {
      return await this.itemsRepository.searchByName(searchTerm);
    } catch (error) {
      logger.error('Error in searchItems service:', error);
      throw error;
    }
  }

  async getItemsWithPagination(page, limit) {
    try {
      return await this.itemsRepository.findWithPagination(page, limit);
    } catch (error) {
      logger.error('Error in getItemsWithPagination service:', error);
      throw error;
    }
  }
}

module.exports = ItemsService;
