const express = require("express");
const routes = require("./routes");

const app = express();

app.use(express.json());

app.use(routes);

const PORT = process.env.PORT || 4010;

app.listen(PORT, () => {
  console.log(`🚀 Analytics service running on port ${PORT}`);
});

module.exports = app;
