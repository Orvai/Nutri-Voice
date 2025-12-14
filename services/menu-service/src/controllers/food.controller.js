const {
  createFoodItem,
  listFoodItems,
  updateFoodItem,
  deleteFoodItem,
} = require("../services/food.service");
const { FoodItemCreateRequestDto, FoodItemUpdateRequestDto, FoodListQueryDto } = require("../dto/food.dto");

const createFoodItemController = async (req, res, next) => {
  try {
    const dto = FoodItemCreateRequestDto.parse(req.body);
    const result = await createFoodItem(dto);
    res.status(201).json({
      message: "Food item created successfully",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};
const listFoodItemsController = async (req, res, next) => {
  try {
    const query = FoodListQueryDto.parse(req.query || {});
    const result = await listFoodItems(query);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};
const updateFoodItemController = async (req, res, next) => {
  try {
    const dto = FoodItemUpdateRequestDto.parse(req.body);
    const result = await updateFoodItem(req.params.id, dto);
    res.json({
      message: "Food item updated successfully",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};
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
  updateFoodItem: updateFoodItemController,
  deleteFoodItem: deleteFoodItemController,

};