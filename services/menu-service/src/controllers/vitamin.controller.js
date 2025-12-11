const vitaminService = require("../services/vitamin.service.js");
const { VitaminCreateDto } = require("../dto/vitamin.dto");


const VitaminController = {
  /**
   * @openapi
   * /internal/menu/vitamins:
   *   get:
   *     tags:
   *       - Menu - Vitamins
   *     summary: List vitamins (internal)
   *     security:
   *       - internalToken: []
   *     responses:
   *       200:
   *         description: List of vitamins
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Menu_VitaminResponseDto'
   */
  async list(req, res, next) {
    try {
      const data = await vitaminService.listVitamins();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @openapi
   * /internal/menu/vitamins:
   *   post:
   *     tags:
   *       - Menu - Vitamins
   *     summary: Create a vitamin (internal)
   *     security:
   *       - internalToken: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Menu_VitaminCreateDto'
   *     responses:
   *       201:
   *         description: Vitamin created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Menu_VitaminResponseDto'
   */
  async create(req, res, next) {
    try {
      const payload = VitaminCreateDto.parse(req.body);
      const data = await vitaminService.createVitamin(payload);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  }
  
};

module.exports = VitaminController;