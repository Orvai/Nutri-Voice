const {
  createFoodItem,
  listFoodItems,
  updateFoodItem,
  deleteFoodItem,
  listByCategory,
  searchByName,
} = require("../services/food.service");

/**
 * @openapi
 * /internal/menu/food:
 *   post:
 *     tags:
 *       - Menu - Food
 *     summary: Create a food item (internal)
 *     security:
 *       - internalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu_FoodItemCreateRequestDto'
 *     responses:
 *       201:
 *         description: Food item created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu_FoodItemResponseDto'
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
 * /internal/menu/food:
 *   get:
 *     tags:
 *       - Menu - Food
 *     summary: List food items (internal)
 *     security:
 *       - internalToken: []
 *     responses:
 *       200:
 *         description: List of food items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu_FoodItemResponseDto'
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
 * /internal/menu/food/{id}:
 *   put:
 *     tags:
 *       - Menu - Food
 *     summary: Update a food item (internal)
 *     security:
 *       - internalToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu_FoodItemUpdateRequestDto'
 *     responses:
 *       200:
 *         description: Updated food item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu_FoodItemResponseDto'
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
 * /internal/menu/food/{id}:
 *   delete:
 *     tags:
 *       - Menu - Food
 *     summary: Delete a food item (internal)
 *     security:
 *       - internalToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Food item deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 * /internal/menu/food/by-category:
 *   get:
 *     tags:
 *       - Menu - Food
 *     summary: List food items by category (internal)
 *     security:
 *       - internalToken: []
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Food items filtered by category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu_FoodItemResponseDto'
 */
const listByCategoryController = async (req, res, next) => {
  try {
    const category = req.query.category;
    if (!category) return res.status(400).json({ message: "category is required" });

    const result = await listByCategory(category);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /internal/menu/food/search:
 *   get:
 *     tags:
 *       - Menu - Food
 *     summary: Search food items by name (internal)
 *     security:
 *       - internalToken: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu_FoodItemResponseDto'
 */
const searchByNameController = async (req, res, next) => {
  try {
    const name = req.query.name;
    if (!name) return res.status(400).json({ message: "name is required" });

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