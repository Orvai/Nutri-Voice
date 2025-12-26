// routes.js
const { Router } = require("express");
const verifyInternalToken = require("./middleware/verifyInternalToken");

/* Controllers */
const Food = require("./controllers/food.controller");
const TemplateMenus = require("./controllers/templateMenu.controller");
const ClientMenus = require("./controllers/clientMenu.controller");
const VitaminController = require("./controllers/vitamin.controller.js");
const MealTemplates = require("./controllers/mealTemplate.controller");

const router = Router();

/* =============================================================================
   SECURITY BARRIER 
============================================================================= */
router.use(verifyInternalToken); 

/* ===========================
   MEAL TEMPLATE ROUTES
   =========================== */
router.post("/internal/menu/meal-templates", MealTemplates.createMealTemplate);
router.get("/internal/menu/meal-templates", MealTemplates.listMealTemplates);
router.get("/internal/menu/meal-templates/:id", MealTemplates.getMealTemplate);
router.put("/internal/menu/meal-templates/:id", MealTemplates.updateMealTemplate);
router.delete("/internal/menu/meal-templates/:id", MealTemplates.deleteMealTemplate);

/* ===========================
   FOOD ROUTES
   =========================== */
router.post("/internal/menu/food", Food.createFoodItem);
router.get("/internal/menu/food", Food.listFoodItems);
router.put("/internal/menu/food/:id", Food.updateFoodItem);
router.delete("/internal/menu/food/:id", Food.deleteFoodItem);

/* ===========================
   VITAMIN ROUTES
   =========================== */
router.get("/internal/menu/vitamins", VitaminController.list);
router.post("/internal/menu/vitamins", VitaminController.create);

/* ===========================
   TEMPLATE MENU ROUTES
   =========================== */
router.post("/internal/menu/template-menus", TemplateMenus.createTemplateMenu);
router.get("/internal/menu/template-menus", TemplateMenus.listTemplateMenus);
router.get("/internal/menu/template-menus/:id", TemplateMenus.getTemplateMenu);
router.put("/internal/menu/template-menus/:id", TemplateMenus.updateTemplateMenu);
router.delete("/internal/menu/template-menus/:id", TemplateMenus.deleteTemplateMenu);

/* ===========================
   CLIENT MENU ROUTES
   =========================== */
router.post("/internal/menu/client-menus", ClientMenus.createClientMenu);
router.get("/internal/menu/client-menus", ClientMenus.listClientMenus);
router.get("/internal/menu/client-menus/:id", ClientMenus.getClientMenu);
router.put("/internal/menu/client-menus/:id", ClientMenus.updateClientMenu);
router.delete("/internal/menu/client-menus/:id", ClientMenus.deleteClientMenu);

router.post("/internal/menu/client-menus/from-template", ClientMenus.createClientMenuFromTemplate);

module.exports = router;