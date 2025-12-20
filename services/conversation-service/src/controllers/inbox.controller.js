// src/controllers/inbox.controller.js

const { getPendingClientMessages } = require("../services/inbox.service");


const getPending = async (req, res, next) => {
  try {
    const pending = await getPendingClientMessages({});
    return res.json({ data: pending });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPending };
