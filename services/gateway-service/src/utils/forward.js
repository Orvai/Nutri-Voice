import axios from "axios";

export function forward(baseURL, targetPath, options = {}) {
  const { preservePath = false } = options;

  return async (req, res, next) => {
    let url = "";
    const method = req.method.toLowerCase();

    try {
      if (!baseURL) {
        console.error("❌ Missing baseURL for forward:", targetPath);
        return res.status(500).json({ message: "Gateway misconfiguration" });
      }

      /* ============================
          Resolve target URL
      ============================ */
      let resolvedPath = preservePath ? req.path : targetPath;

      if (resolvedPath && resolvedPath.includes(":")) {
        for (const [key, value] of Object.entries(req.params)) {
          resolvedPath = resolvedPath.replace(`:${key}`, value);
        }
      }

      url = `${baseURL}${resolvedPath}`;

      /* ============================
          Identity Injection Logic 
          מחלץ את המזהים כדי למנוע "undefined" בשרת הפנימי
      ============================ */
      // 1. מחלץ clientId מה-body (ביצירה) או מה-query (ברשימה) או מה-identity (אם הלקוח מחובר)
      const clientId = 
        req.body?.clientId || 
        req.query?.clientId || 
        req.identity?.clientId || 
        req.headers["x-client-id"];

      // 2. מחלץ coachId מהזהות של המשתמש המחובר או מה-headers
      const coachId = 
        req.identity?.coachId || 
        req.identity?.userId || 
        req.headers["x-coach-id"];

      /* ============================
          Build SAFE headers
      ============================ */
      const headers = {
        // Internal auth
        "x-internal-token": process.env.INTERNAL_TOKEN,

        // הזרקת זהות מפורשת לשרת הפנימי
        "x-client-id": clientId,
        "x-coach-id": coachId,
        "x-user-id": req.identity?.userId || req.headers["x-user-id"],

        // MCP identity (שמירה על תאימות למבנה הקיים שלך)
        "x-mcp-sender": req.headers["x-mcp-sender"],
        "x-mcp-client-id": clientId, 
        "x-mcp-user-id": req.identity?.userId,

        // העברת אימות מקורי
        authorization: req.headers.authorization,
        cookie: req.headers.cookie,

        // Cache control
        "cache-control": "no-cache",
        pragma: "no-cache",
        expires: "0",
      };

      // ניקוי headers שהם null/undefined
      Object.keys(headers).forEach((k) => {
        if (headers[k] === undefined || headers[k] === null) {
          delete headers[k];
        }
      });

      /* ============================
          Axios config
      ============================ */
      const config = {
        method,
        url,
        headers,
        params: req.query,
        withCredentials: true,
      };

      const isMultipart = req.is("multipart/form-data");

      if (isMultipart) {
        config.data = req;
        config.headers["content-type"] = req.headers["content-type"];
        config.maxBodyLength = Infinity;
        config.maxContentLength = Infinity;
      } else if (method !== "get" && method !== "delete") {
        config.data = { ...req.body };
      }

      console.log(`➡️ FORWARDING ${method.toUpperCase()}: ${url} | Client: ${clientId}`);

      const response = await axios(config);

      /* ============================
          Forward cookies & response
      ============================ */
      const cookies = response.headers["set-cookie"];
      if (cookies) {
        res.setHeader("set-cookie", cookies);
      }

      const isAuthRoute =
        targetPath === "/internal/auth/login" ||
        targetPath === "/internal/auth/logout" ||
        targetPath === "/internal/auth/token/refresh";

      if (isAuthRoute) {
        return res.status(response.status).json(response.data);
      }

      const payload = response.data;
      if (payload?.data !== undefined) {
        return res.status(response.status).json({ data: payload.data });
      }

      return res.status(response.status).json({ data: payload });

    } catch (err) {
      console.error("❌ ERROR on", method.toUpperCase(), url);
      if (err.response) {
        return res.status(err.response.status).json({
          error: err.response.data?.message || err.response.data || "Error",
        });
      }
      next(err);
    }
  };
}