const { z } = require("zod");

const ConversationChannelEnum = z.enum([
  "WHATSAPP",
  "TELEGRAM",
  "APP",
]);

const MessageSenderEnum = z.enum([
  "CLIENT",
  "COACH",
  "AI",
]);

const MessageContentTypeEnum = z.enum([
  "TEXT",
  "IMAGE",
  "AUDIO",
  "VIDEO",
]);

const MessageHandledByEnum = z.enum([
  "AI",
  "COACH",
]);

const AIDecisionEnum = z.enum([
  "AUTO_REPLY",
  "COACH_REPLY",
]);

module.exports = {
  ConversationChannelEnum,
  MessageSenderEnum,
  MessageContentTypeEnum,
  MessageHandledByEnum,
  AIDecisionEnum,
};
