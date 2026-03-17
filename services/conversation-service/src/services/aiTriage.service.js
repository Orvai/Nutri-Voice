const { prisma } = require("../db/prisma");
const { AiTriageInputDto } = require("../dtos/aiTriage.dto");
const { runMcp } = require("../clients/mcp.client");

const triageClientMessage = async (payload) => {
  const { messageId } = AiTriageInputDto.parse(payload);

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: { conversation: true },
  });

  if (!message || message.sender !== "CLIENT") return;

  const previousMessages = await prisma.message.findMany({
    where: {
      conversationId: message.conversationId,
      id: { not: messageId }, 
      createdAt: { lt: message.createdAt }, 
    },
    orderBy: { createdAt: 'desc' }, 
    take: 10, 
    select: {
      sender: true,
      text: true,
      contentType: true,
      mediaUrl: true,
    }
  });

  const history = previousMessages.reverse().map(msg => {
    let content = msg.text;
    if (msg.contentType !== 'TEXT' && !content) {
       content = msg.mediaUrl ? `[${msg.contentType}] ${msg.mediaUrl}` : `[${msg.contentType} Message]`; 
    }

    if (!content) return null;

    return {

      role: msg.sender === "CLIENT" ? "user" : "assistant",
      content: content
    };
  }).filter(Boolean); 

  const trustedActor = {
    userId: message.conversation.clientId,
    role: "client",
  };

  const mcpResult = await runMcp({
    conversationId: message.conversationId,
    messageId: message.id,
    sender: "client",
    clientId: message.conversation.clientId,
    contentType: message.contentType,
    media: message.mediaUrl
      ? {
          mediaUrl: message.mediaUrl,
          mediaMimeType: message.mediaMimeType || undefined,
          mediaDurationSec:
            typeof message.mediaDurationSec === "number"
              ? message.mediaDurationSec
              : undefined,
          mediaThumbnail: message.mediaThumbnail || undefined,
        }
      : undefined,
    userText: message.text || "",
    history: history
  }, trustedActor);

  
  let decision = mcpResult.decision || "AUTO_REPLY";
  let replyText = mcpResult.replyText;
  let coachSuggestedReply = mcpResult.coachSuggestedReply || null;

  if (typeof mcpResult === 'string') {
     replyText = mcpResult;
     decision = "AUTO_REPLY";
     coachSuggestedReply = null;
  }

  await prisma.message.update({
    where: { id: messageId },
    data: {
      aiDecision: decision,
      aiSuggestedReply: decision === "COACH_REPLY" ? coachSuggestedReply : replyText,
      handledBy: "AI", 
      handledAt: new Date()
    },
  });
};

module.exports = { triageClientMessage };
