const buildIdentity = (req) => ({
    coachId: req.headers["x-coach-id"] || undefined,
    clientId: req.headers["x-client-id"] || undefined,
    userId: req.headers["x-user-id"] || undefined,
  });
  
  function injectIdentity(req, _res, next) {
    req.identity = buildIdentity(req);
    next();
  }
  
  module.exports = { injectIdentity };