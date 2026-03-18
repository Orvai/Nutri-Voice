function firstNonEmpty(...values) {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    const text = String(value).trim();
    if (!text || text === "undefined" || text === "null") continue;
    return text;
  }
  return null;
}

export function verifyInternalToken(req, res, next) {
  const token = req.headers["x-internal-token"];
  if (!token) return next();

  if (token !== process.env.INTERNAL_TOKEN) {
    return res.status(401).json({ error: "Invalid internal token" });
  }

  const role = firstNonEmpty(
    req.headers["x-role"],
    req.headers["x-mcp-sender"],
    req.headers["x-client-id"] ? "client" : "coach"
  );

  const actorId = firstNonEmpty(
    req.headers["x-actor-id"],
    req.headers["x-mcp-user-id"],
    req.headers["x-user-id"],
    req.headers["x-coach-id"],
    req.headers["x-client-id"],
    req.headers["x-mcp-client-id"]
  );

  const subjectId = firstNonEmpty(
    req.headers["x-user-id"],
    req.headers["x-mcp-client-id"],
    req.headers["x-client-id"],
    actorId
  );

  if (!subjectId) {
    return res.status(400).json({ error: "Missing ID for internal request" });
  }

  req.isInternal = true;
  req.user = {
    id: subjectId,
    userId: subjectId,
    actorId: actorId || subjectId,
    actorType: "service",
    role: role || "coach",
    tenantId: firstNonEmpty(req.headers["x-tenant-id"]),
    coachId:
      role === "coach"
        ? firstNonEmpty(req.headers["x-coach-id"], actorId)
        : firstNonEmpty(req.headers["x-coach-id"]),
    sessionId: firstNonEmpty(req.headers["x-session-id"], "internal"),
    source: "INTERNAL",
  };

  return next();
}
