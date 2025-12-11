// src/swagger.js (or wherever swagger-jsdoc is configured)

const swaggerJSDoc = require('swagger-jsdoc');
const dtoSchemas = require('./docs/zod-schemas');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Client Tracking Service API',
        version: '1.0.0',
        description: 'Internal service for tracking client meals, workouts, weights, and day selections.',
    },

    servers: [{ url: 'http://localhost:4004' }],

    components: {
        schemas: {
            ...dtoSchemas,
        },

        securitySchemes: {
            internalToken: {
                type: "apiKey",
                in: "header",
                name: "x-internal-token"
            }
        }
    },

    security: [
        {
            internalToken: []
        }
    ]
};

const options = {
    definition: swaggerDefinition,
    apis: ['./src/controllers/*.js'],
};

module.exports = swaggerJSDoc(options);
