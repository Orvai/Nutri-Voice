// routes.js
const { Router } = require("express");
const verifyInternalToken = require("./middleware/verifyInternalToken");
const { injectIdentity } = require("./middleware/injectIdentity");


/* Controllers */
const Food = require("./controllers/food.controller");
const TemplateMenus = require("./controllers/templateMenu.controller");
const ClientMenus = require("./controllers/clientMenu.controller");
const VitaminController = require("./controllers/vitamin.controller.js");
const MealTemplates = require("./controllers/mealTemplate.controller");

const router = Router();



/* ===========================
   MEAL TEMPLATE ROUTES
   =========================== */

// Create MealTemplate
router.post("/internal/menu/meal-templates",verifyInternalToken,MealTemplates.createMealTemplate);
 // List MealTemplates (by coachId injected by gateway)
 router.get("/internal/menu/meal-templates",verifyInternalToken,MealTemplates.listMealTemplates);
 // Get MealTemplate by ID
 router.get("/internal/menu/meal-templates/:id",verifyInternalToken, MealTemplates.getMealTemplate);
 // Update MealTemplate
 router.put("/internal/menu/meal-templates/:id",verifyInternalToken,MealTemplates.updateMealTemplate);
 // Delete MealTemplate
 router.delete("/internal/menu/meal-templates/:id",verifyInternalToken,MealTemplates.deleteMealTemplate);

/* ===========================
   FOOD ROUTES
   =========================== */

router.post("/internal/menu/food", verifyInternalToken, Food.createFoodItem);
router.get("/internal/menu/food", verifyInternalToken, Food.listFoodItems);
router.put("/internal/menu/food/:id", verifyInternalToken, Food.updateFoodItem);
router.delete("/internal/menu/food/:id", verifyInternalToken, Food.deleteFoodItem);

/* ===========================
   VITAMIN ROUTES
   =========================== */
router.get("/internal/menu/vitamins", verifyInternalToken, VitaminController.list);
router.post("/internal/menu/vitamins", verifyInternalToken, VitaminController.create);


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

router.post("/internal/menu/client-menus/from-template",verifyInternalToken,injectIdentity,ClientMenus.createClientMenuFromTemplate);

module.exports = router;
