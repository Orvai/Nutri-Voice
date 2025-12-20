// src/controllers/webhook.controller.js

const { handleIncomingMessage } = require("../services/webhook.service");


const incoming = async (req, res, next) => {
  try {
    const result = await handleIncomingMessage(req.body);
    return res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { incoming };
