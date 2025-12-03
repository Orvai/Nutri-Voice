const {
  createClientMenu,
  listClientMenus,
  getClientMenu,
  updateClientMenu,
  deleteClientMenu,
  createClientMenuFromTemplate,
} = require("../services/clientMenu.service");

/**
 * INTERNAL ONLY
 * POST /internal/menu/client-menus
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
 * INTERNAL ONLY
 * GET /internal/menu/client-menus
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
 * INTERNAL ONLY
 * GET /internal/menu/client-menus/:id
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
 * INTERNAL ONLY
 * PUT /internal/menu/client-menus/:id
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
 * INTERNAL ONLY
 * DELETE /internal/menu/client-menus/:id
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
 * INTERNAL ONLY
 * POST /internal/menu/client-menus/from-template
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
