const axios = require("axios");

const getTelegramApiBaseUrl = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error(
      "TELEGRAM_BOT_TOKEN is missing. Cannot send outbound Telegram message."
    );
  }
  return `https://api.telegram.org/bot${token}`;
};

const sendTelegramTextMessage = async ({ chatId, text }) => {
  const res = await axios.post(`${getTelegramApiBaseUrl()}/sendMessage`, {
    chat_id: Number(chatId), 
    text,
  });

  console.log("📨 Telegram API response:", res.data);

  if (!res.data.ok) {
    throw new Error(
      `Telegram send failed: ${res.data.description}`
    );
  }
};
module.exports = {
  sendTelegramTextMessage,
};
