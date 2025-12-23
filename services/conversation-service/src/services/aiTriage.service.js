const { prisma } = require("../db/prisma");
const { AiTriageInputDto } = require("../dtos/aiTriage.dto");
const { runMcp } = require("../clients/mcp.client");

const triageClientMessage = async (payload) => {
  const { messageId } = AiTriageInputDto.parse(payload);

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: {
      conversation: true,
    },
  });

  if (!message) return;
  if (message.sender !== "CLIENT") return;

  const mcpResult = await runMcp({
    conversationId: message.conversationId,
    messageId: message.id,
    sender: "client", 
    clientId: message.conversation.clientId, 

  });

  await prisma.message.update({
    where: { id: messageId },
    data: {
      aiDecision: mcpResult.decision,
      aiSuggestedReply: mcpResult.replyText,
    },
  });
};

module.exports = { triageClientMessage };
