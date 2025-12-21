const { prisma } = require("../db/prisma");
const { AiTriageInputDto } = require("../dtos/aiTriage.dto");
const { clientTriageAI } = require("../ai/clientTriageAI");

const triageClientMessage = async (payload) => {
  const { messageId } = AiTriageInputDto.parse(payload);

  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!message) return;

  if (message.sender !== "CLIENT") return;

  const aiResult = await clientTriageAI({
    text: message.text || "",
  });

  await prisma.message.update({
    where: { id: messageId },
    data: {
      aiDecision: aiResult.decision,
      aiSuggestedReply: aiResult.suggestedReply,
    },
  });
};

module.exports = { triageClientMessage };
