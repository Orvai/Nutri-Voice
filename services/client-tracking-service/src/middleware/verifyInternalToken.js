module.exports = function verifyInternalToken(req, res, next) {
  const token = req.headers["x-internal-token"];

  if (!token) {
    return next();
  }

  if (token !== process.env.INTERNAL_TOKEN) {
    return res.status(401).json({ message: "Invalid internal token" });
  }

  const userId = req.headers["x-user-id"];
  const role = req.headers["x-role"];

  if (!userId) {
    console.warn("⚠️ Internal request missing x-user-id");
  }

  req.isInternal = true;

  req.user = {
    id: userId,       
    role: role,
    source: "INTERNAL",
  };

  next();
};