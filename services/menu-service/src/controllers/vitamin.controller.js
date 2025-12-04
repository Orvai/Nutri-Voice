const { VitaminCreateDto, VitaminUpdateDto } = require("../dto/vitamin.dto.js");
const vitaminService = require("../services/vitamin.service.js");


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
