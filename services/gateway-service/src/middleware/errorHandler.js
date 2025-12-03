export function errorHandler(err, req, res, next) {
    const status = err.status || 500;
  
    res.status(status).json({
      error: {
        message: err.message || "Internal server error",
        code: err.code,
        details: err.details,
      },
    });
  }
  