// src/app.js
const express = require('express');
const routes = require('./routes');


const { errorHandler } = require('./common/errors');
const { logger, dbLogger } = require('./middleware/logger');
const { injectIdentity } = require('./middleware/injectIdentity');

const app = express();

app.use(logger);
app.use(express.json());


app.use(injectIdentity); 

app.use(dbLogger);

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// Routes
app.use(routes);

// Error handler (always last)
app.use(errorHandler);

module.exports = app;