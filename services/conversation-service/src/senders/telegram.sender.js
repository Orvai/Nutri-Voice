const axios = require("axios");

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

const sendTelegramTextMessage = async ({ chatId, text }) => {
  const res = await axios.post(`${TELEGRAM_API}/sendMessage`, {
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
