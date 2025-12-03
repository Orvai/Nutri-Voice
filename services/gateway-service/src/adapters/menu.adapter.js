// src/adapters/menu.adapter.js
import axios from "axios";

const MENU_SERVICE_URL = process.env.MENU_SERVICE_URL;
const INTERNAL_MENU_TOKEN = process.env.INTERNAL_TOKEN;

if (!MENU_SERVICE_URL) {
  throw new Error(
    `❌ Invalid or missing MENU_SERVICE_URL in .env → "${MENU_SERVICE_URL}"`
  );
}

if (!INTERNAL_MENU_TOKEN) {
  throw new Error(`❌ Missing MENU_INTERNAL_TOKEN in .env`);
}

const menuClient = axios.create({
  baseURL: MENU_SERVICE_URL,
  timeout: 8000,
});

// מוסיפים טוקן פנימי לכל בקשה
menuClient.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers["x-internal-token"] = INTERNAL_MENU_TOKEN;
  return config;
});

// =====================================================
// ===============  MENU ADAPTER API  ==================
// =====================================================

export const menuAdapter = {
  /* ========================
       FOOD
     ======================== */

  async createFoodItem(payload) {
    return (await menuClient.post("/internal/menu/food", payload)).data;
  },

  async listFoodItems(query) {
    return (
      await menuClient.get("/internal/menu/food", { params: query })
    ).data;
  },

  async searchFoodByName(name) {
    return (
      await menuClient.get("/internal/menu/food/search", {
        params: { name },
      })
    ).data;
  },

  async listFoodByCategory(category) {
    return (
      await menuClient.get("/internal/menu/food/by-category", {
        params: { category },
      })
    ).data;
  },

  async updateFoodItem(id, payload) {
    return (
      await menuClient.put(`/internal/menu/food/${id}`, payload)
    ).data;
  },

  async deleteFoodItem(id) {
    return (await menuClient.delete(`/internal/menu/food/${id}`)).data;
  },

  /* ========================
       MEAL TEMPLATES
     ======================== */

  async createMealTemplate(payload) {
    return (
      await menuClient.post("/internal/menu/templates", payload)
    ).data;
  },

  async listMealTemplates(query) {
    return (
      await menuClient.get("/internal/menu/templates", { params: query })
    ).data;
  },

  async getMealTemplate(id) {
    return (
      await menuClient.get(`/internal/menu/templates/${id}`)
    ).data;
  },

  async upsertMealTemplate(id, payload) {
    return (
      await menuClient.put(`/internal/menu/templates/${id}`, payload)
    ).data;
  },

  async deleteMealTemplate(id) {
    return (
      await menuClient.delete(`/internal/menu/templates/${id}`)
    ).data;
  },

  /* ========================
       TEMPLATE MENUS
     ======================== */

  async createTemplateMenu(payload) {
    return (
      await menuClient.post("/internal/menu/template-menus", payload)
    ).data;
  },

  async listTemplateMenus(query) {
    return (
      await menuClient.get("/internal/menu/template-menus", {
        params: query,
      })
    ).data;
  },

  async getTemplateMenu(id) {
    return (
      await menuClient.get(`/internal/menu/template-menus/${id}`)
    ).data;
  },

  async updateTemplateMenu(id, payload) {
    return (
      await menuClient.put(`/internal/menu/template-menus/${id}`, payload)
    ).data;
  },

  async deleteTemplateMenu(id) {
    return (
      await menuClient.delete(`/internal/menu/template-menus/${id}`)
    ).data;
  },

  /* ========================
       CLIENT MENUS
     ======================== */

  async createClientMenu(payload) {
    return (
      await menuClient.post("/internal/menu/client-menus", payload)
    ).data;
  },

  async listClientMenus(query) {
    return (
      await menuClient.get("/internal/menu/client-menus", {
        params: query,
      })
    ).data;
  },

  async getClientMenu(id) {
    return (
      await menuClient.get(`/internal/menu/client-menus/${id}`)
    ).data;
  },

  async updateClientMenu(id, payload) {
    return (
      await menuClient.put(`/internal/menu/client-menus/${id}`, payload)
    ).data;
  },

  async deleteClientMenu(id) {
    return (
      await menuClient.delete(`/internal/menu/client-menus/${id}`)
    ).data;
  },

  async createClientMenuFromTemplate(payload) {
    return (
      await menuClient.post(
        "/internal/menu/client-menus/from-template",
        payload
      )
    ).data;
  },
};
