import axios from "axios";

const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN;

export const aggregateClients = async (BASE) => {
  const usersRes = await axios.get(`${BASE}/internal/users`, {
    headers: { "x-internal-token": INTERNAL_TOKEN },
  });

  const rawUsers = Array.isArray(usersRes.data)
    ? usersRes.data
    : Array.isArray(usersRes.data?.data)
    ? usersRes.data.data
    : [];

  const enriched = await Promise.all(
    rawUsers.map(async (user) => {
      const infoRes = await axios.get(`${BASE}/internal/users/${user.id}/info`, {
        headers: { "x-internal-token": INTERNAL_TOKEN },
      });

      const rawInfo = infoRes.data;

      const info =
        Array.isArray(rawInfo) ? rawInfo[0] :
        rawInfo?.data ? rawInfo.data :
        (rawInfo && typeof rawInfo === "object") ? rawInfo :
        {};

      const prefs = info.preferences ?? {};

      return {
        id: user.id,
        name:
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          user.email ||
          user.phone ||
          "לא צוין",

        phone: user.phone || "",
        email: user.email || "",

        profileImageUrl: info.profileImageUrl ?? null,
        gender: info.gender ?? null,
        age: info.age ?? null,
        height: info.height ?? null,
        weight: info.weight ?? prefs.weight ?? null,
        goals: info.goals ?? prefs.goals ?? null,
        activityLevel: info.activityLevel ?? prefs.activityLevel ?? null,

        creationDate: info.createdAt || user.createdAt || null,
        city: info.city ?? null,
        address: info.address ?? null,
      };
    })
  );

  return enriched;
};
