import axios from "axios";
import { Router } from "express";
import { authRequired } from "../middleware/authRequired.js";
import { forward } from "../utils/forward.js";

const r = Router();

const CLIENT_SERVICE_URL = process.env.IDM_SERVICE_URL;
const IDM_SERVICE_URL = process.env.IDM_SERVICE_URL;

const withInternalHeaders = (req) => ({
  "x-internal-token": process.env.INTERNAL_TOKEN,
  ...(req.headers.authorization && { authorization: req.headers.authorization }),
  ...(req.headers.cookie && { cookie: req.headers.cookie }),
});

const buildClientName = (client, idmUser) => {
  if (client?.name) return client.name;
  const nameParts = [idmUser?.firstName, idmUser?.lastName].filter(Boolean);
  if (nameParts.length) return nameParts.join(" ");
  return client?.id || idmUser?.id || "";
};

// GET /api/clients → aggregated client + IDM profile info
r.get("/", authRequired, async (req, res, next) => {
  try {
    if (!CLIENT_SERVICE_URL || !IDM_SERVICE_URL) {
      console.error("❌ Missing CLIENT_SERVICE_URL or IDM_SERVICE_URL");
      return res.status(500).json({ message: "Gateway misconfiguration" });
    }

    const headers = withInternalHeaders(req);

    const clientsResponse = await axios.get(
      `${CLIENT_SERVICE_URL}/internal/clients`,
      {
        headers,
        params: req.query,
        withCredentials: true,
      }
    );

    const rawClients = Array.isArray(clientsResponse.data?.data)
      ? clientsResponse.data.data
      : Array.isArray(clientsResponse.data)
        ? clientsResponse.data
        : [];

    const enrichedClients = await Promise.all(
      rawClients.map(async (client) => {
        const userId = client.userId || client.id;

        if (!userId) return { ...client, profileImageUrl: null };

        const [userRes, infoRes] = await Promise.all([
          axios
            .get(`${IDM_SERVICE_URL}/internal/users/${userId}`, {
              headers,
              withCredentials: true,
            })
            .catch(() => null),
          axios
            .get(`${IDM_SERVICE_URL}/internal/users/${userId}/info`, {
              headers,
              withCredentials: true,
            })
            .catch(() => null),
        ]);

        const idmUser = userRes?.data || {};
        const userInfo = infoRes?.data || {};

        return {
          ...client,
          userId,
          name: buildClientName(client, idmUser),
          phone: client.phone || idmUser.phone || "",
          profileImageUrl: userInfo.profileImageUrl || null,
          gender: userInfo.gender ?? null,
          age: userInfo.age ?? null,
          height: userInfo.height ?? null,
          weight: userInfo.weight ?? null,
          goals: userInfo.goals ?? client.goals ?? null,
          activityLevel: userInfo.activityLevel ?? client.activityLevel ?? null,
          creationDate:
            client.creationDate ||
            client.createdAt ||
            userInfo.createdAt ||
            idmUser.createdAt ||
            null,
          city: userInfo.city ?? client.city ?? null,
          address: userInfo.address ?? client.address ?? null,
          activeWorkoutProgram: client.activeWorkoutProgram ?? null,
          activeMenu: client.activeMenu ?? null,
          progressSummaries: client.progressSummaries ?? null,
          healthMetrics: client.healthMetrics ?? null,
          idmUser,
          userInfo,
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