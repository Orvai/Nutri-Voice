const {
  createExercise,
  listExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
} = require("../services/exercise.service");

const {
  ExerciseCreateDto,
  ExerciseUpdateDto,
  ExerciseFilterDto,
} = require("../dto/exercise.dto");

/**
 * INTERNAL ONLY
 * POST /internal/workout/exercises
 */
const createExerciseController = async (req, res, next) => {
  try {
    const payload = ExerciseCreateDto.parse(req.body);
    const result = await createExercise(payload);
    res.status(201).json({ message: "Exercise created", data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * GET /internal/workout/exercises
 */
const listExercisesController = async (req, res, next) => {
  try {
    const filters = ExerciseFilterDto.parse(req.query);
    const result = await listExercises(filters);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * GET /internal/workout/exercises/:id
 */
const getExerciseController = async (req, res, next) => {
  try {
    const result = await getExerciseById(req.params.id);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * PUT /internal/workout/exercises/:id
 */
const updateExerciseController = async (req, res, next) => {
  try {
    const payload = ExerciseUpdateDto.parse({ ...req.body, id: req.params.id });
    const result = await updateExercise(payload);
    res.json({ message: "Exercise updated", data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * DELETE /internal/workout/exercises/:id
 */
const deleteExerciseController = async (req, res, next) => {
  try {
    await deleteExercise(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createExercise: createExerciseController,
  listExercises: listExercisesController,
  getExercise: getExerciseController,
  updateExercise: updateExerciseController,
  deleteExercise: deleteExerciseController,
};
