const vitaminService = require("../services/vitamin.service.js");
const { VitaminCreateDto } = require("../dto/vitamin.dto");

const VitaminController = {
  async list(req, res, next) {
    try {
      const data = await vitaminService.listVitamins();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
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