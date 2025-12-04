// routes.js
const { Router } = require("express");
const verifyInternalToken = require("./middleware/verifyInternalToken");

/* Controllers */
const Food = require("./controllers/food.controller");
const MealTemplates = require("./controllers/mealTemplate.controller");
const TemplateMenus = require("./controllers/templateMenu.controller");
const ClientMenus = require("./controllers/clientMenu.controller");
const VitaminController = require("./controllers/vitamin.controller.js");

const router = Router();

/* ===========================
   FOOD ROUTES
   =========================== */

router.post("/internal/menu/food", verifyInternalToken, Food.createFoodItem);
router.get("/internal/menu/food", verifyInternalToken, Food.listFoodItems);
router.get("/internal/menu/food/search", verifyInternalToken, Food.searchByName);
router.get("/internal/menu/food/by-category", verifyInternalToken, Food.listByCategory);
router.put("/internal/menu/food/:id", verifyInternalToken, Food.updateFoodItem);
router.delete("/internal/menu/food/:id", verifyInternalToken, Food.deleteFoodItem);

/* ===========================
   VITAMIN ROUTES
   =========================== */

router.get("/internal/menu/vitamins", verifyInternalToken, VitaminController.list);
router.post("/internal/menu/vitamins", verifyInternalToken, VitaminController.create);

/* ===========================
   MEAL TEMPLATE ROUTES
   =========================== */

router.post("/internal/menu/templates", verifyInternalToken, MealTemplates.createMealTemplate);
router.get("/internal/menu/templates", verifyInternalToken, MealTemplates.listMealTemplates);
router.get("/internal/menu/templates/:id", verifyInternalToken, MealTemplates.getMealTemplate);
router.put("/internal/menu/templates/:id", verifyInternalToken, MealTemplates.upsertMealTemplate);
router.delete("/internal/menu/templates/:id", verifyInternalToken, MealTemplates.deleteMealTemplate);

/* ===========================
   TEMPLATE MENU ROUTES
   =========================== */

router.post("/internal/menu/template-menus", verifyInternalToken, TemplateMenus.createTemplateMenu);
router.get("/internal/menu/template-menus", verifyInternalToken, TemplateMenus.listTemplateMenus);
router.get("/internal/menu/template-menus/:id", verifyInternalToken, TemplateMenus.getTemplateMenu);
router.put("/internal/menu/template-menus/:id", verifyInternalToken, TemplateMenus.updateTemplateMenu);
router.delete("/internal/menu/template-menus/:id", verifyInternalToken, TemplateMenus.deleteTemplateMenu);

/* ===========================
   CLIENT MENU ROUTES
   =========================== */

router.post("/internal/menu/client-menus", verifyInternalToken, ClientMenus.createClientMenu);
router.get("/internal/menu/client-menus", verifyInternalToken, ClientMenus.listClientMenus);
router.get("/internal/menu/client-menus/:id", verifyInternalToken, ClientMenus.getClientMenu);
router.put("/internal/menu/client-menus/:id", verifyInternalToken, ClientMenus.updateClientMenu);
router.delete("/internal/menu/client-menus/:id", verifyInternalToken, ClientMenus.deleteClientMenu);

router.post(
  "/internal/menu/client-menus/from-template",
  verifyInternalToken,
  ClientMenus.createClientMenuFromTemplate
);

module.exports = router;
