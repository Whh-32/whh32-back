const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthRepository = require('./auth.repository');
const logger = require('../../common/utils/logger');
const AppError = require('../../common/errors/AppError');

class AuthService {
    constructor() {
        this.authRepository = new AuthRepository();
    }

    async register(userData) {
        try {
            const usernameExists = await this.authRepository.usernameExists(userData.username);
            if (usernameExists) {
                throw new AppError('Username already exists', 400);
            }

            const emailExists = await this.authRepository.emailExists(userData.email);
            if (emailExists) {
                throw new AppError('Email already exists', 400);
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const user = await this.authRepository.create({
                username: userData.username,
                email: userData.email,
                password: hashedPassword,
                firstName: userData.firstName || null,
                lastName: userData.lastName || null,
            });

            const token = this.generateToken(user);

            logger.info(`User registered successfully: ${user.username}`);

            return { user, token };
        } catch (error) {
            logger.error('Error in register service:', error);
            throw error;
        }
    }

    async login(username, password) {
        try {
            const user = await this.authRepository.findByUsername(username);
            if (!user) {
                throw new AppError('Invalid credentials', 401);
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new AppError('Invalid credentials', 401);
            }

            await this.authRepository.updateLastLogin(user.id);

            const { password: _, ...userWithoutPassword } = user;

            const token = this.generateToken(userWithoutPassword);

            logger.info(`User logged in successfully: ${user.username}`);

            return { user: userWithoutPassword, token };
        } catch (error) {
            logger.error('Error in login service:', error);
            throw error;
        }
    }

    async getUserProfile(userId) {
        try {
            const user = await this.authRepository.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            return user;
        } catch (error) {
            logger.error('Error in getUserProfile service:', error);
            throw error;
        }
    }

    generateToken(user) {
        return jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            logger.error('Error verifying token:', error);
            throw new AppError('Invalid or expired token', 401);
        }
    }
}

module.exports = AuthService;
