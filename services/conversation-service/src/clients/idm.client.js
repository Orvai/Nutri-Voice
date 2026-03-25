const axios = require("axios");

const IDM_BASE_URL = process.env.IDM_SERVICE_URL;
const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN;

const INTERNAL_HEADERS = {
  "x-internal-token": INTERNAL_TOKEN,
};

const listUsers = async () => {
  const res = await axios.get(`${IDM_BASE_URL}/internal/users`, {
    headers: INTERNAL_HEADERS,
    timeout: 5000,
  });

  if (Array.isArray(res.data?.data)) {
    return res.data.data;
  }

  if (Array.isArray(res.data)) {
    return res.data;
  }

  return [];
};

const getUserByPhone = async (phone) => {
  try {
    const res = await axios.get(
      `${IDM_BASE_URL}/internal/users/by-phone/${encodeURIComponent(phone)}`,
      {
        headers: INTERNAL_HEADERS,
        timeout: 5000,
      }
    );

    return res.data; // legacy active-user lookup
  } catch (error) {
    if (error?.response?.status !== 404) {
      throw error;
    }

    const users = await listUsers();
    const matched = users.find((user) => String(user?.phone || "") === String(phone));
    return matched || null;
  }
};

const getUserById = async (userId) => {
  const res = await axios.get(
    `${IDM_BASE_URL}/internal/users/${userId}`,
    {
      headers: INTERNAL_HEADERS,
      timeout: 5000,
    }
  );

  return res.data;
};

const getUserInfoById = async (userId) => {
  try {
    const res = await axios.get(
      `${IDM_BASE_URL}/internal/users/${userId}/info`,
      {
        headers: INTERNAL_HEADERS,
        timeout: 5000,
      }
    );

    return res.data;
  } catch (error) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
};

module.exports = { getUserByPhone, getUserById, getUserInfoById };
