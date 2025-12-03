const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const { errorHandler } = require('./common/errors');
const { logger, dbLogger } = require('./middleware/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { attachCookies } = require('./common/http.utils');

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:8081",     // Expo Web
            "http://localhost:4000",
            "http://localhost:19006",    // Expo Web alt
            "http://localhost:3000",     // React Web 
          ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.use(logger);
app.use(express.json());
app.use(attachCookies);
app.use(dbLogger); // Aviya
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/', routes);
// eslint-disable-next-line no-unused-vars
app.use(errorHandler);

module.exports = app;
