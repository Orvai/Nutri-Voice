import { Router } from "express";
import { forward } from "../utils/forward.js";
import { authRequired } from "../middleware/authRequired.js";
import { attachUser } from "../middleware/attachUser.js";
import { requireCoach } from "../middleware/requireRole.js";

const r = Router();
const BASE = process.env.IDM_SERVICE_URL;

// Always attach user (if JWT exists)
r.use(attachUser);

// ==============================
// AUTH ROUTES (public + internal flows)
// ==============================

r.post("/auth/login", forward(BASE, "/internal/auth/login"));
r.post("/auth/register", forward(BASE, "/internal/auth/register"));
r.post("/auth/token/refresh", forward(BASE, "/internal/auth/token/refresh"));

r.post("/auth/logout", authRequired, forward(BASE, "/internal/auth/logout"));

// MFA (valid only when logged in)
r.post("/auth/mfa/register", authRequired, forward(BASE, "/internal/auth/mfa/register"));
r.post("/auth/mfa/verify", authRequired, forward(BASE, "/internal/auth/mfa/verify"));


// ==============================
// CLIENT AGGREGATION (THE REAL UI ENDPOINTS)
// ==============================
// These MUST remain as they are — Saas-app relies on them.

// GET /api/clients → list enriched client profiles for the coach
r.get("/clients", authRequired, requireCoach, async (req, res, next) => {
  try {
    const headers = {
      "x-internal-token": process.env.INTERNAL_TOKEN,
      ...(req.headers.cookie && { cookie: req.headers.cookie }),
    };

    // Fetch users from IDM
    const usersResponse = await forward(BASE, "/internal/users")(req, res, () => {});
    // forward returns the response inside res.json — so we re-fetch manually:
    const rawUsers = usersResponse?.data ?? [];

    const enriched = await Promise.all(
      rawUsers.map(async (user) => {
        const infoRes = await forward(
          BASE,
          `/internal/users/${user.id}/info`
        )(req, res, () => {});
        const info = infoRes?.data ?? {};

        const preferences = info.preferences ?? {};

        return {
          id: user.id,
          name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || user.phone,
          phone: user.phone || "",
          email: user.email || "",
          profileImageUrl: info.profileImageUrl || null,
          gender: info.gender ?? null,
          age: info.age ?? null,
          height: info.height ?? null,
          weight: info.weight ?? preferences.weight ?? null,
          goals: info.goals ?? preferences.goals ?? null,
          activityLevel: info.activityLevel ?? preferences.activityLevel ?? null,
          creationDate: info.createdAt || user.createdAt || null,
          city: info.city ?? null,
          address: info.address ?? null,
        };
      })
    );

    res.json({ data: enriched });
  } catch (err) {
    next(err);
  }
});


// GET /api/clients/:id → raw user info aggregation
r.get("/clients/:id", authRequired, forward(BASE, "/internal/users/:id"));

// ==============================
// USER INFO (UI uses these!)
// ==============================

r.get(
  "/users/:id/info",
  authRequired,
  forward(BASE, "/internal/users/:id/info")
);

r.put(
  "/users/:id/info",
  authRequired,
  forward(BASE, "/internal/users/:id/info")
);

r.delete(
  "/users/:id/info",
  authRequired,
  forward(BASE, "/internal/users/:id/info")
);


// ==============================
// OPTIONAL ADMIN FUNCTIONS (Coach only)
// Keep ONLY if needed
// ==============================

r.get("/users", authRequired, requireCoach, forward(BASE, "/internal/users"));
r.patch("/users/:id", authRequired, requireCoach, forward(BASE, "/internal/users/:id"));

// Subscriptions (unused by UI — keep if needed)
r.get("/subscriptions", authRequired, requireCoach, forward(BASE, "/internal/subscriptions"));
r.get("/subscriptions/:id", authRequired, requireCoach, forward(BASE, "/internal/subscriptions/:id"));
r.post("/subscriptions", authRequired, requireCoach, forward(BASE, "/internal/subscriptions"));
r.patch("/subscriptions/:id", authRequired, requireCoach, forward(BASE, "/internal/subscriptions/:id"));
r.delete("/subscriptions/:id", authRequired, requireCoach, forward(BASE, "/internal/subscriptions/:id"));

export default r;
