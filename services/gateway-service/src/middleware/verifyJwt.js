import jwt from "jsonwebtoken";

export function verifyJwt(req, res, next) {
  const token = req.cookies?.access_token;

  if (!token) {
    req.user = null;
    return next();
  }

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
  } catch (err) {
    req.user = null;
  }

  next();
}
