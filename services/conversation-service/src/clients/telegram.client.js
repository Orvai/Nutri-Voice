const axios = require("axios");

function getTelegramBotToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is missing");
  }
  return token;
}

function getTelegramApiBaseUrl() {
  return `https://api.telegram.org/bot${getTelegramBotToken()}`;
}

function getTelegramFileBaseUrl() {
  return `https://api.telegram.org/file/bot${getTelegramBotToken()}`;
}

function guessMimeFromPath(filePath = "") {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".ogg") || lower.endsWith(".oga")) return "audio/ogg";
  if (lower.endsWith(".mp3")) return "audio/mpeg";
  if (lower.endsWith(".m4a")) return "audio/mp4";
  if (lower.endsWith(".wav")) return "audio/wav";
  if (lower.endsWith(".mp4")) return "video/mp4";
  return undefined;
}

async function getTelegramFileMeta(fileId) {
  if (!fileId) {
    throw new Error("fileId is required");
  }

  const res = await axios.get(`${getTelegramApiBaseUrl()}/getFile`, {
    params: {
      file_id: fileId,
    },
  });

  const payload = res?.data;
  if (!payload?.ok || !payload?.result?.file_path) {
    throw new Error(`Telegram getFile failed for fileId=${fileId}`);
  }

  const filePath = payload.result.file_path;
  return {
    filePath,
    mediaUrl: `${getTelegramFileBaseUrl()}/${filePath}`,
    mediaMimeType: guessMimeFromPath(filePath),
  };
}

module.exports = {
  getTelegramFileMeta,
};
