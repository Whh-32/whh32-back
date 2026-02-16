const prismaClient = require('../../common/database/prisma.client');
const logger = require('../../common/utils/logger');

class AuthRepository {
    constructor() {
        this.prisma = prismaClient.getClient();
    }

    async findByUsername(username) {
        try {
            return await this.prisma.user.findUnique({
                where: { username },
            });
        } catch (error) {
            logger.error('Error in findByUsername:', error);
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            return await this.prisma.user.findUnique({
                where: { email },
            });
        } catch (error) {
            logger.error('Error in findByEmail:', error);
            throw error;
        }
    }

    async usernameExists(username) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { username },
                select: { id: true },
            });
            return !!user;
        } catch (error) {
            logger.error('Error in usernameExists:', error);
            throw error;
        }
    }

    async emailExists(email) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
                select: { id: true },
            });
            return !!user;
        } catch (error) {
            logger.error('Error in emailExists:', error);
            throw error;
        }
    }

    async create(userData) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    username: userData.username,
                    email: userData.email,
                    password: userData.password,
                    firstName: userData.firstName || null,
                    lastName: userData.lastName || null,
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    createdAt: true,
                    updatedAt: true,
                    lastLogin: true,
                },
            });
            return user;
        } catch (error) {
            logger.error('Error in create user:', error);
            throw error;
        }
    }

    async updateLastLogin(userId) {
        try {
            await this.prisma.user.update({
                where: { id: userId },
                data: { lastLogin: new Date() },
            });
        } catch (error) {
            logger.error('Error in updateLastLogin:', error);
            throw error;
        }
    }

    async findById(id) {
        try {
            return await this.prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    createdAt: true,
                    updatedAt: true,
                    lastLogin: true,
                },
            });
        } catch (error) {
            logger.error('Error in findById:', error);
            throw error;
        }
    }
}

module.exports = AuthRepository;
