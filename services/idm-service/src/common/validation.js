const { ZodError } = require('zod');
const { AppError } = require('./errors');

const validateDto = (schema, payload) => {
  try {
    return schema.parse(payload);
  } catch (err) {
    if (err instanceof ZodError) {
      const details = Array.isArray(err.issues)
        ? err.issues
        : Array.isArray(err.errors)
        ? err.errors
        : undefined;
      throw new AppError(400, 'Invalid request payload', 'INVALID_PAYLOAD', details);
    }
    throw err;
  }
};

module.exports = { validateDto };
