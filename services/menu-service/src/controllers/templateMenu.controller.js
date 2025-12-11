const {
  createTemplateMenu,
  listTemplateMenus,
  getTemplateMenu,
  updateTemplateMenu,
  deleteTemplateMenu,
} = require("../services/templateMenu.service");

/**
 * @openapi
 * /internal/menu/template-menus:
 *   post:
 *     tags:
 *       - Menu - Template Menus
 *     summary: Create a template menu (internal)
 *     security:
 *       - internalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu_TemplateMenuCreateDto'
 *     responses:
 *       201:
 *         description: Template menu created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu_TemplateMenuResponseDto'
 */
const createTemplateMenuController = async (req, res, next) => {
  try {
    const result = await createTemplateMenu(req.body);
    res.status(201).json({ message: "Template menu created", data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /internal/menu/template-menus:
 *   get:
 *     tags:
 *       - Menu - Template Menus
 *     summary: List template menus (internal)
 *     security:
 *       - internalToken: []
 *     responses:
 *       200:
 *         description: Template menu list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu_TemplateMenuResponseDto'
 */
const listTemplateMenusController = async (req, res, next) => {
  try {
    const result = await listTemplateMenus(req.query);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /internal/menu/template-menus/{id}:
 *   get:
 *     tags:
 *       - Menu - Template Menus
 *     summary: Get a template menu by ID (internal)
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
 *         description: Template menu details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu_TemplateMenuResponseDto'
 */
const getTemplateMenuController = async (req, res, next) => {
  try {
    const result = await getTemplateMenu(req.params.id);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /internal/menu/template-menus/{id}:
 *   put:
 *     tags:
 *       - Menu - Template Menus
 *     summary: Update a template menu (internal)
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
 *             $ref: '#/components/schemas/Menu_TemplateMenuUpdateDto'
 *     responses:
 *       200:
 *         description: Template menu updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu_TemplateMenuResponseDto'
 */
const updateTemplateMenuController = async (req, res, next) => {
  try {
    const result = await updateTemplateMenu(req.params.id, req.body);
    res.json({ message: "Template menu updated", data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /internal/menu/template-menus/{id}:
 *   delete:
 *     tags:
 *       - Menu - Template Menus
 *     summary: Delete a template menu (internal)
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
 *         description: Template menu deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const deleteTemplateMenuController = async (req, res, next) => {
  try {
    await deleteTemplateMenu(req.params.id);
    res.json({ message: "Template menu deleted" });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createTemplateMenu: createTemplateMenuController,
  listTemplateMenus: listTemplateMenusController,
  getTemplateMenu: getTemplateMenuController,
  updateTemplateMenu: updateTemplateMenuController,
  deleteTemplateMenu: deleteTemplateMenuController,
};
