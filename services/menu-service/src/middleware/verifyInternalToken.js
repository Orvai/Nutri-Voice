module.exports = function verifyInternalToken(req, res, next) {
  const token = req.headers["x-internal-token"];

  if (!token || token !== process.env.INTERNAL_TOKEN) {
    return res.status(401).json({ message: "Invalid internal token" });
  }
  const coachId = req.headers["x-coach-id"];
  const clientId = req.headers["x-client-id"];
  const userId = req.headers["x-user-id"];
  const role = req.headers["x-role"];

  const clean = (val) => (!val || val === "undefined" || val === "null" ? undefined : val);

  req.identity = {
    coachId: clean(coachId),
    clientId: clean(clientId),
    userId: clean(userId),
    role: clean(role),
  };

  req.user = {
    id: req.identity.userId || req.identity.coachId || req.identity.clientId,
    role: req.identity.role,
  };

  next();
};