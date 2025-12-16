const {
  createTemplateMenu,
  listTemplateMenus,
  getTemplateMenu,
  updateTemplateMenu,
  deleteTemplateMenu,
} = require("../services/templateMenu.service");

const {
  createTemplateMenuDTO,
  updateTemplateMenuDTO,
} = require("../dto/templateMenu.dto");

/* =========================
   Helpers
========================= */
const getCoachId = (req) => {
  const coachId = req.identity?.coachId;
  if (!coachId) {
    const err = new Error("Coach identity is required");
    err.status = 400;
    throw err;
  }
  return coachId;
};

/* =========================
   CREATE
========================= */
const createTemplateMenuController = async (req, res, next) => {
  try {
    const coachId = getCoachId(req);
    const dto = createTemplateMenuDTO.parse(req.body);

    const result = await createTemplateMenu(dto, coachId);

    res.status(201).json({
      message: "Template menu created",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

/* =========================
   LIST
========================= */
const listTemplateMenusController = async (req, res, next) => {
  try {
    const coachId = req.headers["x-coach-id"];
    const result = await listTemplateMenus({ coachId });
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/* =========================
   GET BY ID
========================= */
const getTemplateMenuController = async (req, res, next) => {
  try {
    const result = await getTemplateMenu(req.params.id);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/* =========================
   UPDATE
========================= */
const updateTemplateMenuController = async (req, res, next) => {
  try {
    const dto = updateTemplateMenuDTO.parse(req.body);

    const result = await updateTemplateMenu(req.params.id, dto);

    res.json({
      message: "Template menu updated",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

/* =========================
   DELETE
========================= */
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
