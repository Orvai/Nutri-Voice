// src/middleware/verifyInternalToken.js

module.exports = function verifyInternalToken(req, res, next) {
  const token = req.headers["x-internal-token"];

  // 1️⃣ אימות ערוץ
  if (!token || token !== process.env.INTERNAL_TOKEN) {
    return res.status(401).json({
      message: "Invalid internal token"
    });
  }

  const role =
    req.headers["x-mcp-sender"] ||
    (req.headers["x-client-id"] ? "client" : "coach");

  const clientId =
    req.headers["x-mcp-client-id"] ||
    req.headers["x-client-id"] ||
    null;

  const userId =
    req.headers["x-mcp-user-id"] ||
    req.headers["x-coach-id"] ||
    null;

  if (role === "client" && !clientId) {
    return res.status(400).json({
      message: "Missing clientId for internal request"
    });
  }

  if (role !== "client" && !userId) {
    return res.status(400).json({
      message: "Missing userId for internal request"
    });
  }

  req.isInternal = true;

  req.user = {
    id: role === "client" ? clientId : userId,
    role,
    clientId,
    source: "INTERNAL"
  };

  next();
};
