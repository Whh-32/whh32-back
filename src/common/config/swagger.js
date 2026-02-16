const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node.js Auth API',
            version: '1.0.0',
            description: 'RESTful API with JWT authentication, PostgreSQL, and SOLID principles',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/**/*.routes.js', './src/**/*.js'],
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = swaggerSpecs;
