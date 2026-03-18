export function errorHandler(err, req, res, next) {
  const isValidationError = Array.isArray(err?.issues);
  const status = err.status || (isValidationError ? 400 : 500);

  res.status(status).json({
    error: {
      message: isValidationError
        ? "Request validation failed"
        : err.message || "Internal server error",
      code: err.code,
      details: isValidationError ? err.issues : err.details,
    },
  });
}
