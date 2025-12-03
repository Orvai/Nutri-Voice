// gateway/src/adapters/idm.adapter.js
import { createServiceClient } from "../utils/axiosInstance.js";

/* --------------------------
   Validate ENV
--------------------------- */
const IDM_URL = process.env.IDM_SERVICE_URL;

if (!IDM_URL || !IDM_URL.startsWith("http")) {
  throw new Error(`❌ Invalid or missing IDM_SERVICE_URL in .env → "${IDM_URL}"`);
}

/* --------------------------
   Create axios client
--------------------------- */
const idm = createServiceClient(IDM_URL);

/* --------------------------
   API Calls
--------------------------- */
export async function login(payload) {
  const res = await idm.post("/internal/auth/login", payload);
  return res.data;
}

export async function register(payload) {
  const res = await idm.post("/internal/auth/register", payload);
  return res.data;
}

export async function refresh(payload) {
  const res = await idm.post("/internal/auth/token/refresh", payload);
  return res.data;
}

export async function logout(sessionId) {
  const res = await idm.post("/internal/auth/logout", { sessionId });
  return res.data;
}

export async function getUser(userId) {
  const res = await idm.get(`/internal/users/${userId}`);
  return res.data;
}

export async function listUsers() {
  const res = await idm.get("/internal/users");
  return res.data;
}

export async function updateUser(userId, payload) {
  const res = await idm.patch(`/internal/users/${userId}`, payload);
  return res.data;
}

export async function getUserInfo(userId) {
  const res = await idm.get(`/internal/users/${userId}/info`);
  return res.data;
}

export async function listClients() {
  // 1) Get all users
  const users = await listUsers();

  // 2) Filter only clients
  const clients = users.filter((u) => u.role === "client");

  // 3) Enrich each client with info
  const full = await Promise.all(
    clients.map(async (u) => {
      let info = null;

      try {
        info = await getUserInfo(u.id);
      } catch (err) {
        console.warn(`⚠️ Failed to load UserInformation for ${u.id}`);
      }

      return {
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        phone: u.phone,
        avatar:
          info?.profileImageUrl ||
          "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg",
        email: u.email,
        info: {
          age: info?.age ?? null,
          gender: info?.gender ?? null,
          height: info?.height ?? null,
          city: info?.city ?? null,
        },
      };
    })
  );

  return full;
}
