const swaggerJSDoc = require('swagger-jsdoc');
const dtoSchemas = require('./docs/zod-schemas');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: { title: 'Menu Service API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:4002' }],
    components: {
        securitySchemes: {
            internalToken: {
                type: 'apiKey',
                name: 'x-internal-token',
                in: 'header',
            },
        },
        schemas: {
            ...dtoSchemas,
        },
    },
    security: [
        { internalToken: [] },
    ],
};

const options = {
    definition: swaggerDefinition,
    apis: ['./src/controllers/*.js'],
};

module.exports = swaggerJSDoc(options);