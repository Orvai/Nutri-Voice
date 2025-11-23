// src/swagger/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const dtoSchemas = require('./docs/zod-schemas'); // adjust path if needed

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Menu Service API',
        version: '1.0.0',
        description: 'Menu service for food items, meal templates, daily templates, and client menus'
    },
    servers: [
        { url: 'http://localhost:4002' } // adjust if needed
    ],
    components: {
        schemas: {
            ...dtoSchemas, // Zod → JSON Schema
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
    apis: [
        './src/controllers/*.js',         // auto-read openapi blocks
        './src/docs/zod-schemas.js',      // include schemas (required)
    ],
};

module.exports = swaggerJSDoc(options);
