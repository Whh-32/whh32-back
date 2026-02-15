const ItemRepository = require('../repositories/ItemRepository');
const logger = require('../utils/logger');

class ItemService {
  constructor() {
    this.itemRepository = new ItemRepository();
  }

  async getAllItems() {
    try {
      return await this.itemRepository.findAll();
    } catch (error) {
      logger.error('Error in getAllItems service:', error);
      throw error;
    }
  }

  async getItemsByUser(userId) {
    try {
      return await this.itemRepository.findByUserId(userId);
    } catch (error) {
      logger.error('Error in getItemsByUser service:', error);
      throw error;
    }
  }

  async getItemById(id) {
    try {
      const item = await this.itemRepository.findById(id);
      if (!item) {
        throw new Error('Item not found');
      }
      return item;
    } catch (error) {
      logger.error('Error in getItemById service:', error);
      throw error;
    }
  }

  async createItem(itemData, userId) {
    try {
      const item = await this.itemRepository.create({
        name: itemData.name,
        description: itemData.description || null,
        price: itemData.price,
        category: itemData.category || null,
        user_id: userId,
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
      const existingItem = await this.itemRepository.findByIdAndUserId(id, userId);
      if (!existingItem) {
        throw new Error('Item not found or unauthorized');
      }

      const updatedItem = await this.itemRepository.update(id, itemData);
      
      logger.info(`Item updated successfully by user ${userId}: ${updatedItem.name}`);
      return updatedItem;
    } catch (error) {
      logger.error('Error in updateItem service:', error);
      throw error;
    }
  }

  async deleteItem(id, userId) {
    try {
      const existingItem = await this.itemRepository.findByIdAndUserId(id, userId);
      if (!existingItem) {
        throw new Error('Item not found or unauthorized');
      }

      const deleted = await this.itemRepository.delete(id);
      
      logger.info(`Item deleted successfully by user ${userId}`);
      return deleted;
    } catch (error) {
      logger.error('Error in deleteItem service:', error);
      throw error;
    }
  }

  async searchItems(searchTerm) {
    try {
      return await this.itemRepository.searchByName(searchTerm);
    } catch (error) {
      logger.error('Error in searchItems service:', error);
      throw error;
    }
  }

  async getItemsWithPagination(page, limit) {
    try {
      return await this.itemRepository.findWithPagination(page, limit);
    } catch (error) {
      logger.error('Error in getItemsWithPagination service:', error);
      throw error;
    }
  }
}

module.exports = ItemService;
