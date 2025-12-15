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
         Build SAFE headers
         (🔥 do NOT forward raw req.headers)
      ============================ */

      const headers = {
        // Copy only high-level headers
        authorization: req.headers.authorization,
        cookie: req.headers.cookie,

        // Internal auth
        "x-internal-token": process.env.INTERNAL_TOKEN,

        // Forwarded identity (if exists)
        "x-coach-id": req.headers["x-coach-id"],
        "x-client-id": req.headers["x-client-id"],

        // Cache control
        "cache-control": "no-cache",
        pragma: "no-cache",
        expires: "0",
      };

      // 🔥 VERY IMPORTANT — never forward these
      delete headers["content-length"];
      delete headers["content-type"];
      delete headers["host"];
      delete headers["connection"];

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
        // Multipart → stream the request as-is
        config.data = req;
        config.headers["content-type"] = req.headers["content-type"];
        config.maxBodyLength = Infinity;
        config.maxContentLength = Infinity;
      } else if (method !== "get" && method !== "delete") {
        // JSON body
        config.data = { ...req.body };
      }

      console.log("➡️ FORWARDING", method.toUpperCase(), url);

      const response = await axios(config);

      /* ============================
         Forward cookies
      ============================ */

      const cookies = response.headers["set-cookie"];
      if (cookies) {
        res.setHeader("set-cookie", cookies);
      }

      /* ============================
         Auth routes → raw passthrough
      ============================ */

      const isAuthRoute =
        targetPath === "/internal/auth/login" ||
        targetPath === "/internal/auth/logout" ||
        targetPath === "/internal/auth/token/refresh";

      if (isAuthRoute) {
        return res.status(response.status).json(response.data);
      }

      /* ============================
         Response normalizer
      ============================ */

      let payload = response.data;

      if (payload?.data !== undefined) {
        const d = payload.data;

        if (Array.isArray(d)) {
          return res.status(response.status).json({ data: d.flat() });
        }

        return res.status(response.status).json({ data: d });
      }

      if (Array.isArray(payload)) {
        return res.status(response.status).json({ data: payload.flat() });
      }

      return res.status(response.status).json({ data: payload });

    } catch (err) {
      console.error("❌ ERROR on", method.toUpperCase(), url);
      console.error("   STATUS:", err?.response?.status);
      console.error(
        "   RESPONSE DATA:",
        JSON.stringify(err?.response?.data, null, 2)
      );

      if (err.response) {
        return res.status(err.response.status).json({
          error:
            err.response.data?.message ||
            err.response.data ||
            "Error",
        });
      }

      next(err);
    }
  };
}
