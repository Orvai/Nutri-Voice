// src/app.js
const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');

const { errorHandler } = require('./common/errors');
const { logger, dbLogger } = require('./middleware/logger');
const { attachCookies } = require('./common/http.utils');
const { uploadsRoot } = require('./middleware/videoUpload');

const app = express();

// CORS identical to idm-service
app.use(
    cors({
        origin: 'http://localhost:8081', // Expo Web origin
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-internal-token'],
        credentials: true,
    })
);

app.use(logger);
app.use(express.json());
app.use(attachCookies);
app.use(dbLogger);
app.use('/uploads', express.static(path.resolve(uploadsRoot)));


// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// Routes
app.use(routes);

// Error handler (always last)
app.use(errorHandler);

module.exports = app;