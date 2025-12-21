require('dotenv').config();
console.log("ENV TELEGRAM_COACH_ID =", process.env.TELEGRAM_COACH_ID);

const app = require('./app');

const PORT = process.env.PORT || 4006;

app.listen(PORT, () => {
  console.log(`menu-service running on port ${PORT}`);
});
