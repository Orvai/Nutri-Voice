export function ensureClientId(req, res, next) {
  if (req.user?.role === "client") {
    const clientId = String(req.user.id);

    if (req.params && typeof req.params.clientId !== "undefined") {
      req.params.clientId = clientId;
    }

    if (req.body && typeof req.body === "object" && !Array.isArray(req.body)) {
      req.body.clientId = clientId;
    } else if (req.method !== "GET" && req.method !== "DELETE") {
      req.body = { clientId };
    }

    if (req.query && typeof req.query === "object") {
      req.query.clientId = clientId;
    }
  }

  next();
}
