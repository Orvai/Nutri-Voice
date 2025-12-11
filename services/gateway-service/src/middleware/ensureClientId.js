export function ensureClientId(req, res, next) {
    if (req.user?.role === "client") {
      if (typeof req.params.clientId !== "undefined") {
        req.params.clientId = req.user.id;
      }
  
      req.body = { ...req.body, clientId: req.user.id };
      req.query = { ...req.query, clientId: req.user.id };
    }
  
    next();
  }