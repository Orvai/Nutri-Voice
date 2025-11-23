// src/controllers/dailyMenu.controller.js
const {
    createDailyMenuTemplate,
    listDailyMenuTemplates,
    getDailyMenuTemplate,
    upsertDailyMenuTemplate,
    deleteDailyMenuTemplate,
  } = require("../services/dailyMenu.service");
  
  /**
   * @openapi
   * /api/menu/daily-templates:
   *   post:
   *     tags:
   *       - DailyMenuTemplates
   *     summary: Create a new daily menu template
   *     description: Creates a new daily menu template with its associated meals.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/DailyMenuTemplateCreateRequestDto'
   *     responses:
   *       201:
   *         description: Daily menu template created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/DailyMenuTemplateResponseDto'
   */
  const createDailyMenuTemplateController = async (req, res, next) => {
    try {
      const result = await createDailyMenuTemplate(req.body, req.user.userId);
      res.status(201).json({
        message: "Daily menu template created successfully",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/menu/daily-templates:
   *   get:
   *     tags:
   *       - DailyMenuTemplates
   *     summary: List daily menu templates
   *     description: Returns daily menu templates filtered optionally by dayType or coachId.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: dayType
   *         schema:
   *           type: string
   *       - in: query
   *         name: coachId
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of daily menu templates
   */
  const listDailyMenuTemplatesController = async (req, res, next) => {
    try {
      const result = await listDailyMenuTemplates(req.query);
      res.json({ data: result });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/menu/daily-templates/{id}:
   *   get:
   *     tags:
   *       - DailyMenuTemplates
   *     summary: Get a daily menu template
   *     description: Retrieves a single daily template by ID.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Daily menu template data
   *       404:
   *         description: Not found
   */
  const getDailyMenuTemplateController = async (req, res, next) => {
    try {
      const result = await getDailyMenuTemplate(req.params.id);
      res.json({ data: result });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/menu/daily-templates/{id}:
   *   put:
   *     tags:
   *       - DailyMenuTemplates
   *     summary: Upsert a daily menu template
   *     description: Updates an existing daily menu template or creates one if not found.
   *     security:
   *       - bearerAuth: []
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
   *             $ref: '#/components/schemas/DailyMenuTemplateUpdateRequestDto'
   *     responses:
   *       200:
   *         description: Daily menu template upserted successfully
   */
  const upsertDailyMenuTemplateController = async (req, res, next) => {
    try {
      const result = await upsertDailyMenuTemplate(req.params.id, req.body);
      res.json({
        message: "Daily menu template upserted successfully",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/menu/daily-templates/{id}:
   *   delete:
   *     tags:
   *       - DailyMenuTemplates
   *     summary: Delete a daily menu template
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *     responses:
   *       200:
   *         description: Daily menu template deleted successfully
   */
  const deleteDailyMenuTemplateController = async (req, res, next) => {
    try {
      await deleteDailyMenuTemplate(req.params.id);
      res.json({ message: "Daily menu template deleted successfully" });
    } catch (e) {
      next(e);
    }
  };
  
  module.exports = {
    createDailyMenuTemplate: createDailyMenuTemplateController,
    listDailyMenuTemplates: listDailyMenuTemplatesController,
    getDailyMenuTemplate: getDailyMenuTemplateController,
    upsertDailyMenuTemplate: upsertDailyMenuTemplateController,
    deleteDailyMenuTemplate: deleteDailyMenuTemplateController,
  };
  