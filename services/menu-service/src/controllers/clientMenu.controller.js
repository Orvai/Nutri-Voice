const {
  createClientMenu,
  listClientMenus,
  getClientMenu,
  updateClientMenu,
  deleteClientMenu,
  createClientMenuFromTemplate,
} = require("../services/clientMenu/clientMenu.service");

/**
 * @openapi
 * /internal/menu/client-menus:
 *   post:
 *     tags:
 *       - Menu - Client Menus
 *     summary: Create a client menu (internal)
 *     security:
 *       - internalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu_ClientMenuCreateRequestDto'
 *     responses:
 *       201:
 *         description: Client menu created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu_ClientMenuResponseDto'
 */
const createClientMenuController = async (req, res, next) => {
  try {
    const { coachId, ...payload } = req.body;
    const result = await createClientMenu(payload, coachId);

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
 * /internal/menu/client-menus:
 *   get:
 *     tags:
 *       - Menu - Client Menus
 *     summary: List client menus (internal)
 *     security:
 *       - internalToken: []
 *     responses:
 *       200:
 *         description: Client menus list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu_ClientMenuResponseDto'
 */
const listClientMenusController = async (req, res, next) => {
  try {
    const result = await listClientMenus(req.query);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /internal/menu/client-menus/{id}:
 *   get:
 *     tags:
 *       - Menu - Client Menus
 *     summary: Get a client menu by ID (internal)
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
 *         description: Client menu detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu_ClientMenuResponseDto'
 */
const getClientMenuController = async (req, res, next) => {
  try {
    const result = await getClientMenu(req.params.id);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /internal/menu/client-menus/{id}:
 *   put:
 *     tags:
 *       - Menu - Client Menus
 *     summary: Update a client menu (internal)
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
 *             $ref: '#/components/schemas/Menu_ClientMenuUpdateRequestDto'
 *     responses:
 *       200:
 *         description: Updated client menu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu_ClientMenuResponseDto'
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
 * /internal/menu/client-menus/{id}:
 *   delete:
 *     tags:
 *       - Menu - Client Menus
 *     summary: Delete a client menu (internal)
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
 *         description: Client menu deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const deleteClientMenuController = async (req, res, next) => {
  try {
    await deleteClientMenu(req.params.id);
    res.json({ message: "Client menu deactivated successfully" });
  } catch (e) {
    next(e);
  }
};
/**
 * @openapi
 * /internal/menu/client-menus/from-template:
 *   post:
 *     tags:
 *       - Menu - Client Menus
 *     summary: Create a client menu from a template (internal)
 *     security:
 *       - internalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu_ClientMenuCreateFromTemplateDto'
 *     responses:
 *       201:
 *         description: Client menu created from template
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu_ClientMenuResponseDto'
 */
const createClientMenuFromTemplateController = async (req, res, next) => {
  try {
    const result = await createClientMenuFromTemplate(req.body);
    res.status(201).json({
      message: "Client menu created from template successfully",
      data: result,
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
  createClientMenuFromTemplate: createClientMenuFromTemplateController, // ← חדש
};