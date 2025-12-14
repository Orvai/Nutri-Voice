const { ZodError } = require('zod');
const { AppError } = require('./errors');

const validateDto = (schema, payload) => {
  try {
    return schema.parse(payload);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new AppError(400, 'Invalid request payload', 'INVALID_PAYLOAD', err.errors);
    }
    throw err;
  }
};

module.exports = { validateDto };