// src/controllers/message.controller.js

const {
  createCoachMessage,
  getMessagesByConversation,
  markClientMessageHandled,
} = require("../services/message.service");
const {MarkClientMessageHandledDto} = require("../dtos/message.dto")

const { sendMessageExternally } = require("../services/sendMessageExternally.service");


const listMessages = async (req, res, next) => {
  try {
    const conversationId = req.params.id;

    const messages = await getMessagesByConversation({ conversationId });
    return res.json({ data: messages });
  } catch (err) {
    next(err);
  }
};

const sendCoachMessage = async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const { text, contentType = "TEXT", media } = req.body;

    const message = await createCoachMessage({
      conversationId,
      contentType,
      text,
      media,
    });

    await sendMessageExternally(message.id);

    return res.status(201).json({ data: message });
  } catch (err) {
    next(err);
  }
};

const markHandled = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const { handledBy } = MarkClientMessageHandledDto.parse(req.body);

    const updated = await markClientMessageHandled({
      messageId,
      handledBy,
    });

    return res.json({ data: updated });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listMessages,
  sendCoachMessage,
  markHandled,
};
