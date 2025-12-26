// middleware/verifyInternalToken.js

module.exports = function verifyInternalToken(req, res, next) {
  const token = req.headers["x-internal-token"];

  if (!token || token !== process.env.INTERNAL_TOKEN) {
    return res.status(401).json({ message: "Invalid internal token" });
  }


  const clean = (val) => (!val || val === "undefined" || val === "null" ? undefined : val);

  const identity = {
    userId: clean(req.headers["x-user-id"]),
    role: clean(req.headers["x-role"]),
    coachId: clean(req.headers["x-coach-id"]),
    clientId: clean(req.headers["x-client-id"]),
    sessionId: clean(req.headers["x-session-id"]),
  };

  req.identity = identity;

  req.auth = {
    userId: identity.userId,
    role: identity.role,
    sessionId: identity.sessionId,
  };

  req.user = req.auth;

  next();
};