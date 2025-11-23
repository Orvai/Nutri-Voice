// src/routes.js
const { Router } = require("express");

const { authRequired } = require("./middleware/auth");
const requireCoach = require("./middleware/requireCoach");
const requireClientOrCoachOwner = require("./middleware/requireClientOrCoachOwner");

const Food = require("./controllers/food.controller");
const MealTemplates = require("./controllers/mealTemplate.controller");
const DailyTemplates = require("./controllers/dailyMenu.controller");
const ClientMenus = require("./controllers/clientMenu.controller");

const r = Router();

/* Food Items */
r.post("/menu/food", authRequired, requireCoach, Food.createFoodItem);
r.get("/menu/food", Food.listFoodItems);
r.get("/menu/food/by-category", Food.listByCategory);
r.get("/menu/food/search", Food.searchByName);
r.put("/menu/food/:id", authRequired, requireCoach, Food.updateFoodItem);
r.delete("/menu/food/:id", authRequired, requireCoach, Food.deleteFoodItem);

/* Meal Templates */
r.post("/menu/templates", authRequired, requireCoach, MealTemplates.createMealTemplate);
r.get("/menu/templates", authRequired, MealTemplates.listMealTemplates);
r.get("/menu/templates/:id", authRequired, MealTemplates.getMealTemplate);
r.put("/menu/templates/:id", authRequired, requireCoach, MealTemplates.upsertMealTemplate);
r.delete("/menu/templates/:id", authRequired, requireCoach, MealTemplates.deleteMealTemplate);

/* Daily Menu Templates */
r.post("/menu/daily-templates", authRequired, requireCoach, DailyTemplates.createDailyMenuTemplate);
r.get("/menu/daily-templates", authRequired, DailyTemplates.listDailyMenuTemplates);
r.get("/menu/daily-templates/:id", authRequired, DailyTemplates.getDailyMenuTemplate);
r.put("/menu/daily-templates/:id", authRequired, requireCoach, DailyTemplates.upsertDailyMenuTemplate);
r.delete("/menu/daily-templates/:id", authRequired, requireCoach, DailyTemplates.deleteDailyMenuTemplate);

/* Client Menus */
r.post("/menu/client-menus", authRequired, requireCoach, ClientMenus.createClientMenu);
r.get("/menu/client-menus", authRequired, requireClientOrCoachOwner, ClientMenus.listClientMenus);
r.get("/menu/client-menus/:id", authRequired, requireClientOrCoachOwner, ClientMenus.getClientMenu);
r.put("/menu/client-menus/:id", authRequired, requireCoach, ClientMenus.updateClientMenu);
r.delete("/menu/client-menus/:id", authRequired, requireCoach, ClientMenus.deleteClientMenu);

module.exports = r;
