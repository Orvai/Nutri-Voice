import jwt from "jsonwebtoken";

function extractBearerToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || typeof authHeader !== "string") return null;

  const [scheme, token] = authHeader.trim().split(/\s+/, 2);
  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

export function verifyJwt(req, res, next) {
  if (req.isInternal) return next();

  if (req.path === "/webhook/incoming") return next();

  const token = extractBearerToken(req) || req.cookies?.access_token;
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.typ && payload.typ !== "access") {
      req.user = null;
      return next();
    }

    const actorId = payload.sub;
    const role = payload.role;
    const tenantId = payload.tenantId || payload.tid || null;

    req.user = {
      id: actorId,
      userId: actorId,
      actorId,
      actorType: "user",
      role,
      tenantId,
      coachId: role === "coach" ? actorId : null,
      sessionId: payload.sid || null,
      source: "JWT",
    };
  } catch (_err) {
    req.user = null;
  }

  next();
}
