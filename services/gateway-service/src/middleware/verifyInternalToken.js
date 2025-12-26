// middleware/verifyInternalToken.js
export function verifyInternalToken(req, res, next) {
  const token = req.headers["x-internal-token"];
  if (!token) return next();

  if (token !== process.env.INTERNAL_TOKEN) {
    return res.status(401).json({ error: "Invalid internal token" });
  }

  const role = req.headers["x-mcp-sender"] || (req.headers["x-client-id"] ? "client" : "coach");
  
  const id = req.headers["x-mcp-client-id"] || req.headers["x-client-id"] || req.headers["x-mcp-user-id"] || req.headers["x-coach-id"];

  if (!id) {
    return res.status(400).json({ error: "Missing ID for internal request" });
  }
  req.isInternal = true;
  
  req.user = {
    id: id,       
    userId: id,   
    role: role,
    sessionId: "internal",
    source: "INTERNAL",
  };

  return next();
}