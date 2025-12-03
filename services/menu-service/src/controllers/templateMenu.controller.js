const {
    createTemplateMenu,
    listTemplateMenus,
    getTemplateMenu,
    updateTemplateMenu,
    deleteTemplateMenu,
  } = require("../services/templateMenu.service");
  
  // POST /internal/menu/template-menus
  const createTemplateMenuController = async (req, res, next) => {
    try {
      const result = await createTemplateMenu(req.body);
      res.status(201).json({ message: "Template menu created", data: result });
    } catch (e) {
      next(e);
    }
  };
  
  // GET /internal/menu/template-menus
  const listTemplateMenusController = async (req, res, next) => {
    try {
      const result = await listTemplateMenus(req.query);
      res.json({ data: result });
    } catch (e) {
      next(e);
    }
  };
  
  // GET /internal/menu/template-menus/:id
  const getTemplateMenuController = async (req, res, next) => {
    try {
      const result = await getTemplateMenu(req.params.id);
      res.json({ data: result });
    } catch (e) {
      next(e);
    }
  };
  
  // PUT /internal/menu/template-menus/:id
  const updateTemplateMenuController = async (req, res, next) => {
    try {
      const result = await updateTemplateMenu(req.params.id, req.body);
      res.json({ message: "Template menu updated", data: result });
    } catch (e) {
      next(e);
    }
  };
  
  // DELETE /internal/menu/template-menus/:id
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
  