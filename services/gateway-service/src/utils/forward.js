import axios from "axios";

export function forward(baseURL, targetPath, options = {}) {
  const { preservePath = false } = options;

  return async (req, res, next) => {
    let url = "";
    let method = req.method.toLowerCase();

    try {
      if (!baseURL) {
        console.error("❌ Missing baseURL for forward:", targetPath);
        return res.status(500).json({ message: "Gateway misconfiguration" });
      }

      // Resolve URL params (e.g. /users/:id → /users/123)
      let resolvedPath = preservePath ? req.path : targetPath;
      if (resolvedPath && resolvedPath.includes(":")) {
        for (const [key, value] of Object.entries(req.params)) {
          resolvedPath = resolvedPath.replace(`:${key}`, value);
        }
      }

      url = `${baseURL}${resolvedPath}`;

      const headers = {
        ...req.headers,
        "x-internal-token": process.env.INTERNAL_TOKEN,
        "cache-control": "no-cache",
          pragma: "no-cache",
          expires: "0",
      };

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
        config.headers = {
          ...headers,
          "content-type": req.headers["content-type"],
        };
        config.maxBodyLength = Infinity;
        config.maxContentLength = Infinity;
      } else if (method !== "get" && method !== "delete") {
        config.data = { ...req.body };
      }

      console.log("➡️ FORWARDING", method.toUpperCase(), url);

      const response = await axios(config);

      // Forward cookies from microservice
      const cookies = response.headers["set-cookie"];
      if (cookies) {
        res.setHeader("set-cookie", cookies);
      }

      // AUTH ROUTES → return raw
      const isAuthRoute =
        targetPath === "/internal/auth/login" ||
        targetPath === "/internal/auth/logout" ||
        targetPath === "/internal/auth/token/refresh";

      if (isAuthRoute) {
        return res.status(response.status).json(response.data);
      }

      // -------------------------------
      // ⭐ ROBUST NORMALIZER (safe!)
      // -------------------------------
      let payload = response.data;

      // Case A: Has .data field
      if (payload?.data !== undefined) {
        const d = payload.data;

        // 1️⃣ data = array
        if (Array.isArray(d)) {
          const flattened = d.some(Array.isArray) ? d.flat() : d;
          return res.status(response.status).json({ data: flattened });
        }

        // 2️⃣ data = object
        if (typeof d === "object" && d !== null) {
          return res.status(response.status).json({ data: d });
        }

        // 3️⃣ any other type
        return res.status(response.status).json({ data: d });
      }

      // Case B: Entire payload is array
      if (Array.isArray(payload)) {
        const flattened = payload.some(Array.isArray) ? payload.flat() : payload;
        return res.status(response.status).json({ data: flattened });
      }

      // Case C: fallback (leave untouched)
      return res.status(response.status).json({ data: payload });

    } catch (err) {
      console.error("❌ ERROR on", method.toUpperCase(), url);
      console.error("   STATUS:", err?.response?.status);
      console.error("   RESPONSE DATA:", JSON.stringify(err?.response?.data, null, 2));

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
