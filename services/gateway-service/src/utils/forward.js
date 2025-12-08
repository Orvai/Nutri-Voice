import axios from "axios";

export function forward(baseURL, targetPath) {
  return async (req, res, next) => {
    try {
      if (!baseURL) {
        console.error("❌ Missing baseURL for forward:", targetPath);
        return res.status(500).json({ message: "Gateway misconfiguration" });
      }

      // Resolve URL params (e.g. /users/:id → /users/123)
      let resolvedPath = targetPath;
      if (resolvedPath.includes(":")) {
        for (const [key, value] of Object.entries(req.params)) {
          resolvedPath = resolvedPath.replace(`:${key}`, value);
        }
      }

      const url = `${baseURL}${resolvedPath}`;
      const method = req.method.toLowerCase();

      const headers = {
        "x-internal-token": process.env.INTERNAL_TOKEN,

        ...(req.headers.authorization && {
          authorization: req.headers.authorization,
        }),

        // Forward client cookies to the microservice
        ...(req.headers.cookie && {
          cookie: req.headers.cookie,
        }),
      };

      const config = {
        method,
        url,
        headers,
        params: req.query,
        withCredentials: true,
      };

      if (method !== "get" && method !== "delete") {
        config.data = req.body;
      }
      console.log("➡️ FORWARDING", method.toUpperCase(), url, "QUERY:", req.query);

      const response = await axios(config);

      // Forward cookies coming from the microservice
      const cookies = response.headers["set-cookie"];
      if (cookies) {
        res.setHeader("set-cookie", cookies);
      }

      // AUTH routes → return raw (no normalization)
      const isAuthRoute =
        targetPath === "/internal/auth/login" ||
        targetPath === "/internal/auth/logout" ||
        targetPath === "/internal/auth/token/refresh";

      if (isAuthRoute) {
        return res.status(response.status).json(response.data);
      }

      // ⭐ Robust Normalizer – handles BOTH arrays and objects
      let payload = response.data;

      // 1️⃣ If payload.data is a single object → return object
      if (
        payload?.data &&
        typeof payload.data === "object" &&
        !Array.isArray(payload.data)
      ) {
        return res.status(response.status).json({
          data: payload.data,
        });
      }

      // 2️⃣ If payload is an array → return array (flatten nested arrays)
      if (Array.isArray(payload)) {
        return res.status(response.status).json({
          data: payload.flat(),
        });
      }

      // 3️⃣ If payload.data is array → return array (flatten)
      if (Array.isArray(payload?.data)) {
        return res.status(response.status).json({
          data: payload.data.flat(),
        });
      }

      // 4️⃣ If payload.items is array → return array (flatten)
      if (Array.isArray(payload?.items)) {
        return res.status(response.status).json({
          data: payload.items.flat(),
        });
      }

      // 5️⃣ Fallback → return original payload
      return res.status(response.status).json({
        data: payload,
      });

    } catch (err) {
      console.error("❌ ERROR on", method.toUpperCase(), url);
      console.error("   DETAILS:", err?.message, err?.code, err?.response?.status);
      

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
