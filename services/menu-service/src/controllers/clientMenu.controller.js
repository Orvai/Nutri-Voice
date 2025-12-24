const {
  createClientMenu,
  listClientMenus,
  getClientMenu,
  updateClientMenu,
  deleteClientMenu,
  createClientMenuFromTemplate,
} = require("../services/clientMenu/clientMenu.service");

const {
  ClientMenuCreateDto,
  ClientMenuUpdateDto,
  ClientMenuCreateFromTemplateDto,
  ClientMenuListQueryDto,
} = require("../dto/clientMenu.dto");

/* =========================
   Helpers
========================= */
const requireIdentity = (req, keys) => {
  const missing = keys.filter((key) => !req.identity?.[key]);
  if (missing.length) {
    const err = new Error(`Missing required identity: ${missing.join(", ")}`);
    err.status = 400;
    throw err;
  }
};

/* =========================
   CREATE
========================= */
const createClientMenuController = async (req, res, next) => {
  try {
    requireIdentity(req, ["coachId", "clientId"]);
    const dto = ClientMenuCreateDto.parse(req.body);

    const result = await createClientMenu(
      dto,
      req.identity.coachId,
      req.identity.clientId
    );

    res.status(201).json({
      message: "Client menu created successfully",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

/* =========================
   LIST
========================= */
const listClientMenusController = async (req, res, next) => {
  try {
    console.log("🔍 Incoming Query:", req.query);
    console.log("🔍 Incoming Identity:", req.identity);
    const query = ClientMenuListQueryDto.parse(req.query || {});
    const enrichedQuery = {
      ...query,
      coachId: query.coachId ?? req.identity?.coachId,
      clientId: query.clientId ?? req.identity?.clientId,
    };

    const result = await listClientMenus(enrichedQuery);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/* =========================
   GET
========================= */
const getClientMenuController = async (req, res, next) => {
  try {
    const result = await getClientMenu(req.params.id);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/* =========================
   UPDATE
========================= */
const updateClientMenuController = async (req, res, next) => {
  try {
    const dto = ClientMenuUpdateDto.parse(req.body);
    const result = await updateClientMenu(req.params.id, dto);

    res.json({
      message: "Client menu updated successfully",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

/* =========================
   DELETE (deactivate)
========================= */
const deleteClientMenuController = async (req, res, next) => {
  try {
    await deleteClientMenu(req.params.id);
    res.json({ message: "Client menu deactivated successfully" });
  } catch (e) {
    next(e);
  }
};

/* =========================
   CREATE FROM TEMPLATE
========================= */
const createClientMenuFromTemplateController = async (req, res, next) => {
  try {
    console.log("Params:", req.params); 
    console.log("Body:", req.body);
    requireIdentity(req, ["coachId", "clientId"]);
    const dto = ClientMenuCreateFromTemplateDto.parse(req.body);

    const result = await createClientMenuFromTemplate({
      ...dto,
      coachId: req.identity.coachId,
      clientId: req.identity.clientId,
    });

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
  createClientMenuFromTemplate: createClientMenuFromTemplateController,
};
