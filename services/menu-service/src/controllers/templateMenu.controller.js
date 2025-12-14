const {
  createTemplateMenu,
  listTemplateMenus,
  getTemplateMenu,
  updateTemplateMenu,
  deleteTemplateMenu,
} = require("../services/templateMenu.service");
const {
  TemplateMenuCreateDto,
  TemplateMenuUpdateDto,
  TemplateMenuListQueryDto,
} = require("../dto/templateMenu.dto");

const getCoachId = (req) => {
  const coachId = req.identity?.coachId;
  if (!coachId) {
    const err = new Error("Coach identity is required");
    err.status = 400;
    throw err;
  }
  return coachId;
};

const createTemplateMenuController = async (req, res, next) => {
  try {
    const coachId = getCoachId(req);
    const dto = TemplateMenuCreateDto.parse(req.body);
    const result = await createTemplateMenu(dto, coachId);
    res.status(201).json({ message: "Template menu created", data: result });
  } catch (e) {
    next(e);
  }
};
const listTemplateMenusController = async (req, res, next) => {
  try {
    const query = TemplateMenuListQueryDto.parse(req.query || {});
    const result = await listTemplateMenus({ ...query, coachId: query.coachId ?? req.identity?.coachId });
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};
const getTemplateMenuController = async (req, res, next) => {
  try {
    const result = await getTemplateMenu(req.params.id);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};
const updateTemplateMenuController = async (req, res, next) => {
  try {
    const dto = TemplateMenuUpdateDto.parse(req.body);
    const result = await updateTemplateMenu(req.params.id, dto);
    res.json({ message: "Template menu updated", data: result });
  } catch (e) {
    next(e);
  }
};
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