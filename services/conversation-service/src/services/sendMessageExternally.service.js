// src/services/sendMessageExternally.service.js

const { prisma } = require("../db/prisma");
const { sendTelegramTextMessage } = require("../senders/telegram.sender");
const idmClient = require("../clients/idm.client");

const sendMessageExternally = async (messageId) => {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: {
      conversation: true,
    },
  });

  if (!message) {
    throw new Error("Message not found");
  }

  const { conversation } = message;

  const toUser = await idmClient.getUserById(conversation.clientId);

  if (!toUser) {
    throw new Error("Target user not found");
  }

  switch (conversation.channel) {
    case "TELEGRAM": {
      if (!toUser.telegramChatId) return;

      await sendTelegramTextMessage({
        chatId: toUser.phone,
        text: message.text,
      });
      break;
    }

    case "WHATSAPP": {
      // TODO: implement WhatsApp sender
      break;
    }

    case "APP": {
      // TODO: push notification / websocket
      break;
    }

    default:
      throw new Error(`Unsupported channel ${conversation.channel}`);
  }
};

module.exports = {
  sendMessageExternally,
};
