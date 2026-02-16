const prismaClient = require('../../common/database/prisma.client');
const logger = require('../../common/utils/logger');

class ItemsRepository {
  constructor() {
    this.prisma = prismaClient.getClient();
  }

  async findAll() {
    try {
      return await this.prisma.item.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      logger.error('Error in findAll:', error);
      throw error;
    }
  }

  async findByUserId(userId) {
    try {
      return await this.prisma.item.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      logger.error('Error in findByUserId:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await this.prisma.item.findUnique({
        where: { id },
      });
    } catch (error) {
      logger.error('Error in findById:', error);
      throw error;
    }
  }

  async findByIdAndUserId(id, userId) {
    try {
      return await this.prisma.item.findFirst({
        where: {
          id,
          userId,
        },
      });
    } catch (error) {
      logger.error('Error in findByIdAndUserId:', error);
      throw error;
    }
  }

  async create(itemData) {
    try {
      return await this.prisma.item.create({
        data: {
          name: itemData.name,
          description: itemData.description || null,
          price: itemData.price,
          category: itemData.category || null,
          userId: itemData.userId,
        },
      });
    } catch (error) {
      logger.error('Error in create:', error);
      throw error;
    }
  }

  async update(id, itemData) {
    try {
      return await this.prisma.item.update({
        where: { id },
        data: {
          ...(itemData.name && { name: itemData.name }),
          ...(itemData.description !== undefined && { description: itemData.description }),
          ...(itemData.price && { price: itemData.price }),
          ...(itemData.category !== undefined && { category: itemData.category }),
        },
      });
    } catch (error) {
      logger.error('Error in update:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.prisma.item.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      logger.error('Error in delete:', error);
      throw error;
    }
  }

  async searchByName(searchTerm) {
    try {
      return await this.prisma.item.findMany({
        where: {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      logger.error('Error in searchByName:', error);
      throw error;
    }
  }

  async findWithPagination(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        this.prisma.item.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.item.count(),
      ]);

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error in findWithPagination:', error);
      throw error;
    }
  }
}

module.exports = ItemsRepository;
