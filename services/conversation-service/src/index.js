const path = require("path");
const dotenv = require("dotenv");

// Load env from current working directory first, then fall back to repo root .env.
dotenv.config();
dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
  override: false,
});

console.log("ENV TELEGRAM_COACH_ID =", process.env.TELEGRAM_COACH_ID);
console.log(
  "ENV TELEGRAM_BOT_TOKEN configured =",
  Boolean(process.env.TELEGRAM_BOT_TOKEN)
);

const app = require('./app');

const PORT = process.env.PORT || 4006;

app.listen(PORT, () => {
  console.log(`conversation-service running on port ${PORT}`);
});
