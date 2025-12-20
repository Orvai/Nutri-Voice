const CoachNutritionDeviationService = require(
    "../../services/analytics/coachNutritionDeviation.service"
  );
  
  module.exports.getCoachNutritionDeviations = async (req, res, next) => {
    try {
      const { coachId } = req.params;
  
      const deviations =
        await CoachNutritionDeviationService.getCoachNutritionDeviations(
          coachId
        );
  
      return res.json(deviations);
    } catch (err) {
      next(err);
    }
  };
  