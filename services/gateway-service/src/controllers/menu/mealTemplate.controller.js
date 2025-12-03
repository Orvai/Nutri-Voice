// src/controllers/menu/mealTemplate.controller.js
import { menuAdapter } from "../../adapters/menu.adapter.js";
import {
  MealTemplateCreateDto,
  MealTemplateUpsertDto,
  MealTemplateListQueryDto,
} from "../../dtos/menu/mealTemplate.dto.js";

/**
 * @openapi
 * tags:
 *   - name: MealTemplates
 *     description: Templates for daily meals configuration
 */
export const MealTemplateController = {
  /**
   * @openapi
   * /api/menu/templates:
   *   post:
   *     summary: Create meal template
   *     tags: [MealTemplates]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/MealTemplateCreateDto"
   *     responses:
   *       201:
   *         description: Meal template created
   */
  async create(req, res, next) {
    try {
      const coachId = req.user.id;
      const payload = MealTemplateCreateDto.parse(req.body);

      const data = await menuAdapter.createMealTemplate({
        ...payload,
        coachId,
      });

      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @openapi
   * /api/menu/templates:
   *   get:
   *     summary: List meal templates
   *     tags: [MealTemplates]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: coachId
   *         schema:
   *           type: string
   */
  async list(req, res, next) {
    try {
      const coachId = req.user.id;
      MealTemplateListQueryDto.parse(req.query); // Basic validation

      const data = await menuAdapter.listMealTemplates({ coachId });

      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @openapi
   * /api/menu/templates/{id}:
   *   get:
   *     summary: Get meal template by ID
   *     tags: [MealTemplates]
   *     security:
   *       - bearerAuth: []
   */
  async get(req, res, next) {
    try {
      const data = await menuAdapter.getMealTemplate(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @openapi
   * /api/menu/templates/{id}:
   *   put:
   *     summary: Update meal template
   *     tags: [MealTemplates]
   *     security:
   *       - bearerAuth: []
   */
  async update(req, res, next) {
    try {
      const id = req.params.id;
      const payload = MealTemplateUpsertDto.parse(req.body);

      const data = await menuAdapter.upsertMealTemplate(id, payload);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @openapi
   * /api/menu/templates/{id}:
   *   delete:
   *     summary: Delete meal template
   *     tags: [MealTemplates]
   *     security:
   *       - bearerAuth: []
   */
  async remove(req, res, next) {
    try {
      const data = await menuAdapter.deleteMealTemplate(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
};
