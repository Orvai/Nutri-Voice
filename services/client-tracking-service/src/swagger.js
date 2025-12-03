const swaggerJSDoc = require('swagger-jsdoc');
const dtoSchemas = require('./docs/zod-schemas');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Client Tracking Service API',
        version: '1.0.0',
        description: 'Service for tracking client meals, workouts, weights, and summaries',
    },
    servers: [{ url: 'http://localhost:4004' }],
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