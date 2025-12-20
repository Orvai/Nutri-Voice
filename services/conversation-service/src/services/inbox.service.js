const { prisma } = require("../db/prisma");
const { GetPendingMessagesDto } = require("../dtos/inbox.dto");
const { MessageSender, AIDecision } = require("@prisma/client");

/**
 * שליפת הודעות CLIENT שממתינות למענה מאמן
 *
 * תנאים:
 * - sender === CLIENT
 * - aiDecision === COACH_REPLY
 * - handledAt === null
 */
const getPendingClientMessages = async (payload = {}) => {
  // DTO קיים בעיקר לשמירה על אחידות ו־future-proof
  GetPendingMessagesDto.parse(payload);

  return prisma.message.findMany({
    where: {
      sender: MessageSender.CLIENT,
      aiDecision: AIDecision.COACH_REPLY,
      handledAt: null,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

module.exports = {
  getPendingClientMessages,
};
