const pinoHttp = require('pino-http');
const { prisma } = require('../db/prisma');

const pretty = process.env.NODE_ENV !== 'production';
const logger = pinoHttp({
  transport: pretty ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
  customLogLevel: (res, err) => {
    if (err) return 'error';
    if (res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  }
});

const dbLogger = async (req, res, next) => {
  const start = Date.now();
  res.on('finish', async () => {
    try {
      await prisma.logEntry.create({
        data: {
          level: res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
          method: req.method,
          path: req.originalUrl || req.url,
          status: res.statusCode,
          userId: req.auth?.userId || null,
          ip: req.ip,
          userAgent: req.headers['user-agent'] || null,
          message: 'http_request',
          meta: { durationMs: Date.now() - start, query: req.query }
        }
      });
    } catch {
    }
  });
  next();
};

module.exports = { logger, dbLogger };