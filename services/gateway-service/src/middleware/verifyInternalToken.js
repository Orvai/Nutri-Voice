export function verifyInternalToken(req, res, next) {
  const token = req.headers["x-internal-token"];
  if (!token) {
    return next();
  }
  console.log("check1");
  if (token !== process.env.INTERNAL_TOKEN) {
    return res.status(401).json({ error: "Invalid internal token" });
  }
  console.log("check2");

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
    return res.status(400).json({ error: "Missing clientId for internal request" });
  }

  if (role !== "client" && !userId) {
    return res.status(400).json({ error: "Missing userId for internal request" });
  }

  req.isInternal = true;

  req.user = {
    id: role === "client" ? clientId : userId,
    role,
    clientId,
    source: "INTERNAL",
  };

  return next();
}
