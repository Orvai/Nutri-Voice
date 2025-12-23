export function verifyInternalToken(req, res, next) {
  const token = req.headers["x-internal-token"];

  if (!token) {
    return next();
  }

  if (token !== process.env.INTERNAL_TOKEN) {
    return res.status(401).json({ error: "Invalid internal token" });
  }

  const role = req.headers["x-mcp-sender"] || "client";
  const clientId = req.headers["x-mcp-client-id"] || null;

  req.isInternal = true;

  req.user = {
    id: role === "client" ? clientId : req.headers["x-mcp-user-id"] || null,

    role,
    clientId,
    source: "INTERNAL",
  };

  return next();
}
