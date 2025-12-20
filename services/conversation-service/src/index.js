require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4006;

app.listen(PORT, () => {
  console.log(`menu-service running on port ${PORT}`);
});
