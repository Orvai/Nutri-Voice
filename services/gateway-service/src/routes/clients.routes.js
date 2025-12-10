import axios from "axios";
import { Router } from "express";
import { authRequired } from "../middleware/authRequired.js";
import { forward } from "../utils/forward.js";

const r = Router();

const IDM_SERVICE_URL = process.env.IDM_SERVICE_URL;

const withInternalHeaders = (req) => ({
  "x-internal-token": process.env.INTERNAL_TOKEN,
  ...(req.headers.authorization && { authorization: req.headers.authorization }),
  ...(req.headers.cookie && { cookie: req.headers.cookie }),
});

const buildClientName = (user) => {
  const nameParts = [user?.firstName, user?.lastName].filter(Boolean);
  if (nameParts.length) return nameParts.join(" ");
  return user?.email || user?.phone || user?.id || "";
};

// GET /api/clients → aggregated client + IDM profile info
r.get("/", authRequired, async (req, res, next) => {
  try {
    if (!IDM_SERVICE_URL) return res.status(500).json({ message: "Gateway misconfiguration" });

    const headers = withInternalHeaders(req);

    const usersResponse = await axios.get(`${IDM_SERVICE_URL}/internal/users`, {
      headers,
      params: req.query,
      withCredentials: true,
    });

    const rawUsers = Array.isArray(usersResponse.data?.data)
      ? usersResponse.data.data
      : Array.isArray(usersResponse.data)
        ? usersResponse.data
        : [];

    const enrichedClients = await Promise.all(
      rawUsers.map(async (user) => {
        const infoRes = await axios
          .get(`${IDM_SERVICE_URL}/internal/users/${user.id}/info`, {
            headers,
            withCredentials: true,
          })
          .catch(() => null);

        const userInfo = infoRes?.data || {};
        const preferences = userInfo.preferences || {};

        const goals = userInfo.goals ?? preferences.goals ?? null;
        const activityLevel = userInfo.activityLevel ?? preferences.activityLevel ?? null;
        const weight = userInfo.weight ?? preferences.weight ?? null;

        return {
          id: user.id,
          name: buildClientName(user),
          phone: user.phone || "",
          email: user.email || "",
          profileImageUrl: userInfo.profileImageUrl || null,
          gender: userInfo.gender ?? null,
          age: userInfo.age ?? null,
          height: userInfo.height ?? null,
          weight: weight ?? null,
          goals: goals ?? null,
          activityLevel: activityLevel ?? null,
          creationDate: userInfo.createdAt || user.createdAt || null,
          city: userInfo.city ?? null,
          address: userInfo.address ?? null,
        };
      })
    );

    return res.json({ data: enrichedClients });
  } catch (error) {
    next(error);
  }
});

// GET /api/clients/:id
r.get("/:id", authRequired, forward(IDM_SERVICE_URL, "/internal/users/:id"));

// POST /api/clients
r.post("/", authRequired, forward(IDM_SERVICE_URL, "/internal/users"));

// PUT /api/clients/:id
r.put("/:id", authRequired, forward(IDM_SERVICE_URL, "/internal/users/:id"));

// DELETE /api/clients/:id
r.delete("/:id", authRequired, forward(IDM_SERVICE_URL, "/internal/users/:id"));

export default r;