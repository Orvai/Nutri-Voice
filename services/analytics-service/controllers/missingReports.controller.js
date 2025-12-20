// controllers/analytics/missingReports.controller.js

class MissingReportsController {
    constructor({ missingReportsService }) {
      this.missingReportsService = missingReportsService;
    }
  
    getCoachMissingReports = async (req, res, next) => {
      try {
        const { coachId } = req.params;
  
        if (!coachId) {
          return res.status(400).json({
            message: "coachId is required",
          });
        }
  
        const data =
          await this.missingReportsService.getMissingReports(
            coachId
          );
  
        return res.json(data);
      } catch (err) {
        next(err);
      }
    };
  }
  
  module.exports = {
    MissingReportsController,
  };
  