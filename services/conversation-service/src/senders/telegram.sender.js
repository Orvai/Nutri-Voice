const axios = require("axios");

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

const sendTelegramTextMessage = async ({ chatId, text }) => {
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text,
  });
};

module.exports = {
  sendTelegramTextMessage,
};
