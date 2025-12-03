module.exports = function verifyInternalToken(req, res, next) {
    const token = req.headers["x-internal-token"];
  
    if (!token || token !== process.env.INTERNAL_TOKEN) {
      return res.status(401).json({ message: "Invalid internal token" });
    }
  
    next();
  };
  