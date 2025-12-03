import jwt from "jsonwebtoken";

export function verifyJwt(req, res, next) {
  const authHeader = req.headers.authorization;

  // No token? → Just skip, allow public routes like /auth/login
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.typ !== "access") {
      req.user = null;
      return next();
    }

    req.user = {
      sessionId: payload.sid,
      userId: payload.sub,
      role: payload.role,
    };

    next();
  } catch (err) {
    // If token is invalid → treat as unauthenticated, not 401.
    req.user = null;
    next();
  }
}
