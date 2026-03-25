// src/services/food.service.js

const prisma = require("../db/prisma");

const isUniqueConstraintError = (error) => error?.code === "P2002";

const createFoodItem = async (data) => {
  const foodData = {
    name: data.name,
    description: data.description ?? null,
    category: data.category,
    caloriesPer100g: data.caloriesPer100g,
  };

  try {
    return await prisma.foodItem.create({
      data: foodData,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      const err = new Error("Food item with this name already exists");
      err.status = 409;
      throw err;
    }

    throw error;
  }
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
  const existing = await prisma.foodItem.findUnique({
    where: { id },
  });

  if (!existing) {
    const err = new Error("Food item not found");
    err.status = 404;
    throw err;
  }

  return existing;
};

const updateFoodItem = async (id, data) => {
  await getFoodItem(id);

  const foodData = {
    name: data.name ?? undefined,
    description: data.description ?? undefined,
    category: data.category ?? undefined,
    caloriesPer100g: data.caloriesPer100g ?? undefined,
  };

  try {
    return await prisma.foodItem.update({
      where: { id },
      data: foodData,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      const err = new Error("Food item with this name already exists");
      err.status = 409;
      throw err;
    }

    throw error;
  }
};

const deleteFoodItem = async (id) => {
  await getFoodItem(id);

  return prisma.foodItem.delete({
    where: { id },
  });
};

module.exports = {
  createFoodItem,
  listFoodItems,
  getFoodItem,
  updateFoodItem,
  deleteFoodItem,
};
