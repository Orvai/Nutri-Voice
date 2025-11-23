class AppError extends Error {
    constructor(status, message, code, details) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

const errorHandler = (err, _req, res, _next) => {
  const status = err instanceof AppError ? err.status : err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal error',
      code: err.code,
      details: err.details
    }
  });
}

module.exports = {errorHandler, AppError};
  