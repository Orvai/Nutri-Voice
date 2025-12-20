const axios = require("axios");

const MENU_URL = process.env.MENU_SERVICE_URL;
const INTERNAL_TOKEN = process.env.INTERNAL_SERVICE_TOKEN;

const headers = {
  "x-internal-token": INTERNAL_TOKEN
};

const getMealTemplates = () =>
  axios.get(
    `${MENU_URL}/internal/menu/meal-templates`,
    { headers }
  ).then(res => res.data.data);

module.exports = { getMealTemplates };
