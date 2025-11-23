// src/controllers/clientMenu.controller.js
const {
    createClientMenu,
    listClientMenus,
    getClientMenu,
    updateClientMenu,
    deleteClientMenu,
  } = require("../services/clientMenu.service");
  
  /**
   * @openapi
   * /api/menu/client-menus:
   *   post:
   *     tags:
   *       - ClientMenus
   *     summary: Create a client menu
   *     description: Creates a personalized menu for a client, optionally based on a daily template snapshot.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ClientMenuCreateRequestDto'
   *     responses:
   *       201:
   *         description: Client menu created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ClientMenuResponseDto'
   */
  const createClientMenuController = async (req, res, next) => {
    try {
      const result = await createClientMenu(req.body, req.user.userId);
      res.status(201).json({
        message: "Client menu created successfully",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/menu/client-menus:
   *   get:
   *     tags:
   *       - ClientMenus
   *     summary: List client menus
   *     description: Lists client menus filtered by clientId or coachId. Clients can see only their own menus, while coaches can see menus for their clients.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: clientId
   *         required: false
   *         schema:
   *           type: string
   *       - in: query
   *         name: coachId
   *         required: false
   *         schema:
   *           type: string
   *       - in: query
   *         name: includeInactive
   *         required: false
   *         schema:
   *           type: boolean
   *           default: false
   *     responses:
   *       200:
   *         description: List of client menus
   */
  const listClientMenusController = async (req, res, next) => {
    try {
      const result = await listClientMenus(req.query);
      res.json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/menu/client-menus/{id}:
   *   get:
   *     tags:
   *       - ClientMenus
   *     summary: Get a client menu
   *     description: Retrieves a specific client menu by its ID.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Client menu ID
   *     responses:
   *       200:
   *         description: Client menu data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ClientMenuResponseDto'
   *       404:
   *         description: Not found
   */
  const getClientMenuController = async (req, res, next) => {
    try {
      const result = await getClientMenu(req.params.id);
      res.json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/menu/client-menus/{id}:
   *   put:
   *     tags:
   *       - ClientMenus
   *     summary: Update a client menu
   *     description: Updates fields of an existing client menu, such as structureJson, dates, notes, or activation state.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Client menu ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ClientMenuUpdateRequestDto'
   *     responses:
   *       200:
   *         description: Client menu updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ClientMenuResponseDto'
   */
  const updateClientMenuController = async (req, res, next) => {
    try {
      const result = await updateClientMenu(req.params.id, req.body);
      res.json({
        message: "Client menu updated successfully",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/menu/client-menus/{id}:
   *   delete:
   *     tags:
   *       - ClientMenus
   *     summary: Soft delete a client menu
   *     description: Marks a client menu as inactive instead of hard deleting it.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Client menu ID
   *     responses:
   *       200:
   *         description: Client menu deactivated successfully
   */
  const deleteClientMenuController = async (req, res, next) => {
    try {
      await deleteClientMenu(req.params.id);
      res.json({
        message: "Client menu deactivated successfully",
      });
    } catch (e) {
      next(e);
    }
  };
  
  module.exports = {
    createClientMenu: createClientMenuController,
    listClientMenus: listClientMenusController,
    getClientMenu: getClientMenuController,
    updateClientMenu: updateClientMenuController,
    deleteClientMenu: deleteClientMenuController,
  };
  