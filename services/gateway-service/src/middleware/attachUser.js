export function attachUser(req, res, next) {
    req.context = {
      userId: req.user?.userId || null,
      role: req.user?.role || null,
      sessionId: req.user?.sessionId || null,
    };
    next();
  }
  