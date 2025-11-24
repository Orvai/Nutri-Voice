const swaggerJSDoc = require('swagger-jsdoc');
const dtoSchemas = require('./docs/zod-schemas');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Workout Service API',
        version: '1.0.0',
        description: 'Workout service for exercises, templates, and client programs',
    },
    servers: [{ url: 'http://localhost:4003' }],
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
