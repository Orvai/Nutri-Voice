const swaggerJSDoc = require('swagger-jsdoc');
const dtoSchemas = require('./docs/zod-schemas');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Menu Service API',
        version: '1.0.0',
        description: 'Menu service for food items, meal templates, daily templates, and client menus',
    },
    servers: [{ url: 'http://localhost:3002' }],
    components: {
        schemas: {
            ...dtoSchemas,
        },
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};

const options = {
    definition: swaggerDefinition,
    apis: ['./src/controllers/*.js'],
};

module.exports = swaggerJSDoc(options);
