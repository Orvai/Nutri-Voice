// src/controllers/menu/food.controller.js
import { menuAdapter } from "../../adapters/menu.adapter.js";
import {
  FoodCreateDto,
  FoodUpdateDto,
  FoodListQueryDto,
  FoodSearchQueryDto,
} from "../../dtos/menu/food.dto.js";

/**
 * @openapi
 * tags:
 *   - name: Food
 *     description: Food items management
 */

export const FoodController = {
  /**
   * @openapi
   * /api/menu/food:
   *   post:
   *     summary: Create a new food item
   *     tags: [Food]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/FoodCreateDto"
   *     responses:
   *       201:
   *         description: Food item created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/FoodCreateDto"
   */
  async create(req, res, next) {
    try {
      const payload = FoodCreateDto.parse(req.body);
      const data = await menuAdapter.createFoodItem(payload);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @openapi
   * /api/menu/food:
   *   get:
   *     summary: List food items
   *     tags: [Food]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: category
   *         schema:
   *           $ref: "#/components/schemas/FoodListQueryDto/properties/category"
   *     responses:
   *       200:
   *         description: List of food items
   */
  async list(req, res, next) {
    try {
      const query = FoodListQueryDto.parse(req.query);
      const data = await menuAdapter.listFoodItems(query);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @openapi
   * /api/menu/food/search:
   *   get:
   *     summary: Search food items by name
   *     tags: [Food]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: name
   *         required: true
   *         schema:
   *           $ref: "#/components/schemas/FoodSearchQueryDto/properties/name"
   *     responses:
   *       200:
   *         description: Search results
   */
  async search(req, res, next) {
    try {
      const { name } = FoodSearchQueryDto.parse(req.query);
      const data = await menuAdapter.searchFoodByName(name);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @openapi
   * /api/menu/food/by-category:
   *   get:
   *     summary: Get food items by category
   *     tags: [Food]
   *     security:
   *       - bearerAuth: []
   */
  async byCategory(req, res, next) {
    try {
      const { category } = FoodListQueryDto.parse(req.query);
      const data = await menuAdapter.listFoodByCategory(category);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @openapi
   * /api/menu/food/{id}:
   *   put:
   *     summary: Update a food item
   *     tags: [Food]
   *     security:
   *       - bearerAuth: []
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
   *             $ref: "#/components/schemas/FoodUpdateDto"
   */
  async update(req, res, next) {
    try {
      const id = req.params.id;
      const payload = FoodUpdateDto.parse(req.body);
      const data = await menuAdapter.updateFoodItem(id, payload);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @openapi
   * /api/menu/food/{id}:
   *   delete:
   *     summary: Delete a food item
   *     tags: [Food]
   *     security:
   *       - bearerAuth: []
   */
  async remove(req, res, next) {
    try {
      const id = req.params.id;
      const data = await menuAdapter.deleteFoodItem(id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
};
