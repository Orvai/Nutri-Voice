const { prisma } = require("../db/prisma");
const {
  GetOrCreateConversationDto,
  GetConversationsByCoachDto,
  GetConversationByIdDto,
} = require("../dtos/conversation.dto");


const getOrCreateConversation = async (payload) => {
  const { coachId, clientId, channel } =
    GetOrCreateConversationDto.parse(payload);

  return prisma.conversation.upsert({
    where: {
      coachId_clientId_channel: {
        coachId,
        clientId,
        channel,
      },
    },
    update: {},
    create: {
      coachId,
      clientId,
      channel,
    },
  });
};


const getConversationsByCoach = async (payload) => {
  const { coachId } = GetConversationsByCoachDto.parse(payload);
  console.log("🧪 Prisma coachId =", coachId);
  return prisma.conversation.findMany({
    where: { coachId },
    orderBy: { lastMessageAt: "desc" },
  });
};
 
const getConversationById = async (payload) => {
  const { id } = GetConversationByIdDto.parse(payload);

  return prisma.conversation.findUnique({
    where: { id },
  });
};

const touchConversation = async (conversationId) => {
  return prisma.conversation.update({
    where: { id: conversationId },
    data: {
      lastMessageAt: new Date(),
    },
  });
};

module.exports = {
  getOrCreateConversation,
  getConversationsByCoach,
  getConversationById,
  touchConversation,
};
