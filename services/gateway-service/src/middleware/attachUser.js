export function attachUser(req, res, next) {
  if (!req.user) {
    return next();
  }

  req.user = {
    id: req.user.id ?? req.user.userId,
    role: req.user.role,
    sessionId: req.user.sessionId,
  };

  next();
}
