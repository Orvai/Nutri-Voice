// src/services/food.service.js
const prisma = require("../db/prisma");
const {
  FoodItemCreateRequestDto,
  FoodItemUpdateRequestDto,
} = require("../dto/food.dto");

const createFoodItem = async (payload) => {
  const data = FoodItemCreateRequestDto.parse(payload);
  return prisma.foodItem.create({ data });
};

const listFoodItems = async (query) => {
  const search = query?.search;

  return prisma.foodItem.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: { name: "asc" },
  });
};

const getFoodItem = async (id) => {
  const existing = await prisma.foodItem.findUnique({ where: { id } });

  if (!existing) {
    const err = new Error("Food item not found");
    err.status = 404;
    throw err;
  }

  return existing;
};

const upsertFoodItem = async (id, payload) => {
  const data = FoodItemUpdateRequestDto.parse(payload);

  const existing = await prisma.foodItem.findUnique({ where: { id } });

  if (existing) {
    return prisma.foodItem.update({
      where: { id },
      data,
    });
  }

  return prisma.foodItem.create({
    data: { id, ...data },
  });
};

const deleteFoodItem = async (id) => {
  return prisma.foodItem.delete({
    where: { id },
  });
};

module.exports = {
  createFoodItem,
  listFoodItems,
  getFoodItem,
  upsertFoodItem,
  deleteFoodItem,
};
