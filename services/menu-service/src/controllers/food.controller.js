// src/controllers/food.controller.js
const {
  createFoodItem,
  listFoodItems,
  updateFoodItem,
  deleteFoodItem,
  listByCategory,
  searchByName,
} = require("../services/food.service");

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
 *   put:
 *     tags:
 *       - Food
 *     summary: Update a food item
 */
const updateFoodItemController = async (req, res, next) => {
  try {
    const result = await updateFoodItem(req.params.id, req.body);
    res.json({
      message: "Food item updated successfully",
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

/**
 * @openapi
 * /api/menu/food/by-category:
 *   get:
 *     tags:
 *       - Food
 *     summary: List food items by category
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Food items by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FoodItemResponseDto'
 */
const listByCategoryController = async (req, res, next) => {
  try {
    const category = req.query.category;
    if (!category) {
      return res.status(400).json({ message: "category is required" });
    }

    const result = await listByCategory(category);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/menu/food/search:
 *   get:
 *     tags:
 *       - Food
 *     summary: Search food items by name
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Food items matching name search
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FoodItemResponseDto'
 */
const searchByNameController = async (req, res, next) => {
  try {
    const name = req.query.name;
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const result = await searchByName(name);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createFoodItem: createFoodItemController,
  listFoodItems: listFoodItemsController,
  updateFoodItem: updateFoodItemController,
  deleteFoodItem: deleteFoodItemController,
  listByCategory: listByCategoryController,
  searchByName: searchByNameController,
};
