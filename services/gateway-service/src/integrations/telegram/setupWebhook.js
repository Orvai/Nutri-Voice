import "dotenv/config";
import axios from "axios";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PUBLIC_URL = process.env.PUBLIC_WEBHOOK_URL;
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
if (!BOT_TOKEN || !PUBLIC_URL || !SECRET) {
  console.log({
    BOT_TOKEN,
    PUBLIC_URL,
    SECRET,
  });
  throw new Error("Missing Telegram env vars");
}

async function setup() {
  const webhookUrl = `${PUBLIC_URL}/api/webhook/incoming`;

  const res = await axios.post(
    `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
    {
      url: webhookUrl,
      secret_token: SECRET,
    }
  );

  console.log("Telegram webhook set:", res.data);
}

setup().catch(console.error);
