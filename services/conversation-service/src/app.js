const express = require("express");
const routes = require("./routes");

const app = express();

/* ===============================
   Middleware
================================ */

app.use(express.json());

/* ===============================
   Routes
================================ */

app.use("/", routes);

/* ===============================
   Health
================================ */

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

module.exports = app;
