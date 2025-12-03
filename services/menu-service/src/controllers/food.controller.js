const {
  createFoodItem,
  listFoodItems,
  updateFoodItem,
  deleteFoodItem,
  listByCategory,
  searchByName,
} = require("../services/food.service");

/**
 * INTERNAL ONLY
 * POST /internal/menu/food
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
 * INTERNAL ONLY
 * GET /internal/menu/food
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
 * INTERNAL ONLY
 * PUT /internal/menu/food/:id
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
 * INTERNAL ONLY
 * DELETE /internal/menu/food/:id
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
 * INTERNAL ONLY
 * GET /internal/menu/food/by-category
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
 * INTERNAL ONLY
 * GET /internal/menu/food/search
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
