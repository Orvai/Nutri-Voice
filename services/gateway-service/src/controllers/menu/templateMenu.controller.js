// src/controllers/menu/templateMenu.controller.js
import { menuAdapter } from "../../adapters/menu.adapter.js";
import {
  TemplateMenuCreateDto,
  TemplateMenuUpdateDto,
  TemplateMenuListQueryDto,
} from "../../dtos/menu/templateMenu.dto.js";

/**
 * @openapi
 * tags:
 *   - name: TemplateMenus
 *     description: Day-menu templates used to create full menu plans
 */
export const TemplateMenuController = {
  /**
   * @openapi
   * /api/menu/template-menus:
   *   post:
   *     summary: Create a template menu
   *     tags: [TemplateMenus]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/TemplateMenuCreateDto"
   */
  async create(req, res, next) {
    try {
      const coachId = req.user.id;
      const payload = TemplateMenuCreateDto.parse(req.body);

      const data = await menuAdapter.createTemplateMenu({
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
   * /api/menu/template-menus:
   *   get:
   *     summary: List template menus
   *     tags: [TemplateMenus]
   *     security:
   *       - bearerAuth: []
   */
  async list(req, res, next) {
    try {
      const coachId = req.user.id;
      TemplateMenuListQueryDto.parse(req.query);

      const data = await menuAdapter.listTemplateMenus({ coachId });
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @openapi
   * /api/menu/template-menus/{id}:
   *   get:
   *     summary: Get template menu by ID
   *     tags: [TemplateMenus]
   *     security:
   *       - bearerAuth: []
   */
  async get(req, res, next) {
    try {
      const data = await menuAdapter.getTemplateMenu(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @openapi
   * /api/menu/template-menus/{id}:
   *   put:
   *     summary: Update template menu
   *     tags: [TemplateMenus]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/TemplateMenuUpdateDto"
   */
  async update(req, res, next) {
    try {
      const id = req.params.id;
      const payload = TemplateMenuUpdateDto.parse(req.body);

      const data = await menuAdapter.updateTemplateMenu(id, payload);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @openapi
   * /api/menu/template-menus/{id}:
   *   delete:
   *     summary: Delete template menu
   *     tags: [TemplateMenus]
   *     security:
   *       - bearerAuth: []
   */
  async remove(req, res, next) {
    try {
      const data = await menuAdapter.deleteTemplateMenu(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
};
