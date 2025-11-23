// src/controllers/food.controller.js
const {createFoodItem,listFoodItems, getFoodItem,upsertFoodItem,deleteFoodItem,} = require("../services/food.service");
  
  // OPENAPI DOCS WILL READ THESE EXPORTS — NOT ROUTER
  // ROUTING HAPPENS IN routes.js
  
  /**
   * @openapi
   * /api/menu/food:
   *   post:
   *     tags:
   *       - Food
   *     summary: Create a food item
   *     description: Creates a new food item for use in templates.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/FoodItemCreateRequestDto'
   *     responses:
   *       201:
   *         description: Food item created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/FoodItemResponseDto'
   */
  const createFoodItemController = async (req, res, next) => {
    try {
      const result = await createFoodItem(req.body);
      res.status(201).json({
        message: "Food item created successfully",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/menu/food:
   *   get:
   *     tags:
   *       - Food
   *     summary: List food items
   */
  const listFoodItemsController = async (req, res, next) => {
    try {
      const result = await listFoodItems(req.query);
      res.json({ data: result });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/menu/food/{id}:
   *   get:
   *     tags:
   *       - Food
   *     summary: Get a food item by ID
   */
  const getFoodItemController = async (req, res, next) => {
    try {
      const result = await getFoodItem(req.params.id);
      res.json({ data: result });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/menu/food/{id}:
   *   put:
   *     tags:
   *       - Food
   *     summary: Upsert a food item
   */
  const upsertFoodItemController = async (req, res, next) => {
    try {
      const result = await upsertFoodItem(req.params.id, req.body);
      res.json({
        message: "Food item upserted successfully",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/menu/food/{id}:
   *   delete:
   *     tags:
   *       - Food
   *     summary: Delete a food item by ID
   */
  const deleteFoodItemController = async (req, res, next) => {
    try {
      await deleteFoodItem(req.params.id);
      res.json({ message: "Food item deleted successfully" });
    } catch (e) {
      next(e);
    }
  };
  
  module.exports = {
    createFoodItem: createFoodItemController,
    listFoodItems: listFoodItemsController,
    getFoodItem: getFoodItemController,
    upsertFoodItem: upsertFoodItemController,
    deleteFoodItem: deleteFoodItemController,
  };
  