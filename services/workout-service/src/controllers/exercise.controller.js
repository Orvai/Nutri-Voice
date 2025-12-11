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
 * @openapi
 * /internal/workout/exercises:
 *   post:
 *     tags:
 *       - Workout - Exercises
 *     summary: Create an exercise (internal)
 *     security:
 *       - internalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Workout_ExerciseCreateDto'
 *     responses:
 *       201:
 *         description: Exercise created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout_ExerciseResponseDto'
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
 * @openapi
 * /internal/workout/exercises:
 *   get:
 *     tags:
 *       - Workout - Exercises
 *     summary: List exercises (internal)
 *     security:
 *       - internalToken: []
 *     responses:
 *       200:
 *         description: Exercise list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workout_ExerciseResponseDto'
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
 * @openapi
 * /internal/workout/exercises/{id}:
 *   get:
 *     tags:
 *       - Workout - Exercises
 *     summary: Get an exercise by ID (internal)
 *     security:
 *       - internalToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exercise details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout_ExerciseResponseDto'
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
 * @openapi
 * /internal/workout/exercises/{id}:
 *   put:
 *     tags:
 *       - Workout - Exercises
 *     summary: Update an exercise (internal)
 *     security:
 *       - internalToken: []
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
 *             $ref: '#/components/schemas/Workout_ExerciseUpdateDto'
 *     responses:
 *       200:
 *         description: Updated exercise
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout_ExerciseResponseDto'
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
 * @openapi
 * /internal/workout/exercises/{id}:
 *   delete:
 *     tags:
 *       - Workout - Exercises
 *     summary: Delete an exercise (internal)
 *     security:
 *       - internalToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Exercise deleted
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
 * @openapi
 * /internal/workout/exercises/{id}/video:
 *   post:
 *     tags:
 *       - Workout - Exercises
 *     summary: Upload an exercise video (internal)
 *     security:
 *       - internalToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 videoUrl:
 *                   type: string
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
