// src/app.js
const express = require('express');
const routes = require('./routes');
const { errorHandler } = require('./common/errors');
const { logger, dbLogger } = require('./middleware/logger');

const verifyInternalToken = require('./middleware/verifyInternalToken');

const app = express();

app.use(logger);
app.use(express.json());

app.use(verifyInternalToken);

app.use(dbLogger);

app.get('/health', (_req, res) => res.json({ ok: true }));

// Routes
app.use('/', routes);

// Error handler (always last)
app.use(errorHandler);

module.exports = app;