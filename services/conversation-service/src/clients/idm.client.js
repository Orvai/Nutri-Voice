const axios = require("axios");

const IDM_BASE_URL = process.env.IDM_SERVICE_URL;
const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN;

const getUserByPhone = async (phone) => {
  const res = await axios.get(
    `${IDM_BASE_URL}/internal/users/by-phone/${encodeURIComponent(phone)}`,
    {
      headers: {
        "x-internal-token": INTERNAL_TOKEN,
      },
      timeout: 5000,
    }
  );

  return res.data; // { id, role, phone, firstName, lastName, email }
};
const getUserById = async (userId) => {
  const res = await axios.get(
    `${IDM_BASE_URL}/internal/users/${userId}`,
    {
      headers: {
        "x-internal-token": INTERNAL_TOKEN,
      },
      timeout: 5000,
    }
  );

  return res.data;
};

module.exports = {getUserByPhone,getUserById,};