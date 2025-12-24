require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const { errorHandler } = require('./common/errors');
const { logger, dbLogger } = require('./middleware/logger');
const { attachCookies } = require('./common/http.utils');

const app = express();
app.use(
    cors({
        origin: 'http://localhost:8081', 
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.use(logger);
app.use(express.json());
app.use(attachCookies);
app.use(dbLogger);


// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// Routes
app.use( routes);

// Error handler (always last)
app.use(errorHandler);

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`client-tracking-service running on port ${PORT}`);
});

module.exports = app;