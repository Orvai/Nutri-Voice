module.exports = function verifyInternalToken(req, res, next) {
  const token = req.headers["x-internal-token"];
  if (!token) {
    return next();
  }

  if (token !== process.env.INTERNAL_TOKEN) {
    return res.status(401).json({ message: "Invalid internal token" });
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


  req.isInternal = true;

  req.user = {
    id: role === "client" ? clientId : userId,
    role,
    clientId,
    source: "INTERNAL",
  };

  next();
};
