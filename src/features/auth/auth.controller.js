const AuthService = require('./auth.service');
const logger = require('../../common/utils/logger');

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    register = async (req, res, next) => {
        try {
            const result = await this.authService.register(req.body);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const result = await this.authService.login(username, password);

            res.json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getProfile = async (req, res, next) => {
        try {
            const user = await this.authService.getUserProfile(req.user.id);

            res.json({
                success: true,
                message: 'User profile retrieved successfully',
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new AuthController();
