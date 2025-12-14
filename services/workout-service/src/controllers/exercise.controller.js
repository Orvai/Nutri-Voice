const {
  createExercise,
  listExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
  saveExerciseVideo,
} = require("../services/exercise.service");

const {
  ExerciseIdParamDto,
  ExerciseCreateDto,
  ExerciseUpdateDto,
  ExerciseFilterDto,
} = require("../dto/exercise.dto");
const { AppError } = require("../common/errors");

const createExerciseController = async (req, res, next) => {
  try {
    const payload = ExerciseCreateDto.parse(req.body);
    const result = await createExercise(payload);
    res.status(201).json({ message: "Exercise created", data: result });
  } catch (e) {
    next(e);
  }
};

const listExercisesController = async (req, res, next) => {
  try {
    const filters = ExerciseFilterDto.parse(req.query);
    const result = await listExercises(filters);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

const getExerciseController = async (req, res, next) => {
  try {
    const { id } = ExerciseIdParamDto.parse(req.params);
    const result = await getExerciseById(id);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

const updateExerciseController = async (req, res, next) => {
  try {
    const { id } = ExerciseIdParamDto.parse(req.params);
    const payload = ExerciseUpdateDto.parse(req.body);
    const result = await updateExercise(id, payload);
    res.json({ message: "Exercise updated", data: result });
  } catch (e) {
    next(e);
  }
};

const deleteExerciseController = async (req, res, next) => {
  try {
    const { id } = ExerciseIdParamDto.parse(req.params);
    await deleteExercise(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

const uploadExerciseVideoController = async (req, res, next) => {
  try {
    const { id } = ExerciseIdParamDto.parse(req.params);
    if (!req.file) {
      throw new AppError(400, "Video file is required");
    }

    const videoPath = `/uploads/videos/${req.file.filename}`;
    const protocol = req.get("x-forwarded-proto") || req.protocol;
    const host = req.get("x-forwarded-host") || req.get("host");
    const videoUrl = `${protocol}://${host}${videoPath}`;
    await saveExerciseVideo({
      id,
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
