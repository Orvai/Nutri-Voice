export function requireCoach(req, res, next) {
    if (req.user?.role !== "coach") {
      return res.status(403).json({ message: "Coach role required" });
    }
    next();
  }
  
  export function requireClient(req, res, next) {
    if (req.user?.role !== "client") {
      return res.status(403).json({ message: "Client role required" });
    }
    next();
  }
  
  export function requireCoachOrClient(req, res, next) {
    if (req.user?.role !== "coach" && req.user?.role !== "client") {
      return res.status(403).json({ message: "Unauthorized role" });
    }
    next();
  }
  