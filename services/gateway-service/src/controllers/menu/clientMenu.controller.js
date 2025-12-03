// src/controllers/menu/clientMenu.controller.js
import { menuAdapter } from "../../adapters/menu.adapter.js";
import {
  ClientMenuCreateDto,
  ClientMenuUpdateDto,
  ClientMenuFromTemplateDto,
  ClientMenuListQueryDto,
} from "../../dtos/menu/clientMenu.dto.js";

/**
 * @openapi
 * tags:
 *   - name: ClientMenus
 *     description: Menus created for individual clients
 */
export const ClientMenuController = {
  /**
   * @openapi
   * /api/menu/client-menus:
   *   post:
   *     summary: Create a client menu
   *     tags: [ClientMenus]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/ClientMenuCreateDto"
   */
  async create(req, res, next) {
    try {
      const coachId = req.user.id;
      const payload = ClientMenuCreateDto.parse(req.body);

      const data = await menuAdapter.createClientMenu({
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
   * /api/menu/client-menus:
   *   get:
   *     summary: List client menus
   *     tags: [ClientMenus]
   *     security:
   *       - bearerAuth: []
   */
  async list(req, res, next) {
    try {
      const coachId = req.user.id;
      const query = ClientMenuListQueryDto.parse(req.query);

      const data = await menuAdapter.listClientMenus({
        ...query,
        coachId,
      });

      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @openapi
   * /api/menu/client-menus/{id}:
   *   get:
   *     summary: Get client menu by ID
   *     tags: [ClientMenus]
   *     security:
   *       - bearerAuth: []
   */
  async get(req, res, next) {
    try {
      const data = await menuAdapter.getClientMenu(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @openapi
   * /api/menu/client-menus/{id}:
   *   put:
   *     summary: Update client menu
   *     tags: [ClientMenus]
   *     security:
   *       - bearerAuth: []
   */
  async update(req, res, next) {
    try {
      const id = req.params.id;
      const payload = ClientMenuUpdateDto.parse(req.body);

      const data = await menuAdapter.updateClientMenu(id, payload);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @openapi
   * /api/menu/client-menus/{id}:
   *   delete:
   *     summary: Delete client menu
   *     tags: [ClientMenus]
   *     security:
   *       - bearerAuth: []
   */
  async remove(req, res, next) {
    try {
      const data = await menuAdapter.deleteClientMenu(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @openapi
   * /api/menu/client-menus/from-template:
   *   post:
   *     summary: Create client menu from template
   *     tags: [ClientMenus]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/ClientMenuFromTemplateDto"
   */
  async fromTemplate(req, res, next) {
    try {
      const coachId = req.user.id;
      const payload = ClientMenuFromTemplateDto.parse(req.body);

      const data = await menuAdapter.createClientMenuFromTemplate({
        ...payload,
        coachId,
      });

      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  },
};
