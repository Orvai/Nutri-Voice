export default  function verifyTelegramWebhook(req, res, next) {
    const secret =
      req.headers["x-telegram-bot-api-secret-token"];
  
    if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return res.status(401).json({ error: "Invalid Telegram secret" });
    }
  
    next();
  }
  