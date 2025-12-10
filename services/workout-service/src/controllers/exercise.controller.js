const {
  createExercise,
  listExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
  saveExerciseVideo,
} = require("../services/exercise.service");

const {
  ExerciseCreateDto,
  ExerciseUpdateDto,
  ExerciseFilterDto,
} = require("../dto/exercise.dto");
const { AppError } = require("../common/errors");

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


/**
 * INTERNAL ONLY
 * POST /internal/workout/exercises/:id/video
 */
const uploadExerciseVideoController = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError(400, "Video file is required");
    }

    const videoPath = `/uploads/videos/${req.file.filename}`;
    const protocol = req.get("x-forwarded-proto") || req.protocol;
    const host = req.get("x-forwarded-host") || req.get("host");
    const videoUrl = `${protocol}://${host}${videoPath}`;
    await saveExerciseVideo({
      id: req.params.id,
      videoUrl,
    });

    res.status(200).json({ message: "Video uploaded", videoUrl });
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
  uploadExerciseVideo: uploadExerciseVideoController,
};
