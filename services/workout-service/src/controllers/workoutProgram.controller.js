const {
  createProgram,
  listPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
} = require("../services/workoutProgram.service");
const {
  WorkoutProgramCreateRequestDto,
  WorkoutProgramUpdateRequestDto,
} = require("../dto/workoutProgram.dto");

/**
 * INTERNAL ONLY
 * POST /internal/workout/programs
 */
const createProgramController = async (req, res, next) => {
  try {
    const payload = WorkoutProgramCreateRequestDto.parse(req.body);
    const result = await createProgram(payload);
    res.status(201).json({ message: "Workout program created", data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * GET /internal/workout/programs
 */
const listProgramsController = async (req, res, next) => {
  try {
    const result = await listPrograms(req.query);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * GET /internal/workout/programs/:id
 */
const getProgramController = async (req, res, next) => {
  try {
    const result = await getProgramById(req.params.id);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * PUT /internal/workout/programs/:id
 */
const updateProgramController = async (req, res, next) => {
  try {
    const payload = WorkoutProgramUpdateRequestDto.parse(req.body);
    const result = await updateProgram(req.params.id, payload);
    res.json({ message: "Workout program updated", data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * DELETE /internal/workout/programs/:id
 */
const deleteProgramController = async (req, res, next) => {
  try {
    await deleteProgram(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createProgram: createProgramController,
  listPrograms: listProgramsController,
  getProgram: getProgramController,
  updateProgram: updateProgramController,
  deleteProgram: deleteProgramController,
};
