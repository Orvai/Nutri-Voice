// src/controllers/exercise.controller.js
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
   * @openapi
   * /api/workout/exercises:
   *   post:
   *     tags:
   *       - Exercises
   *     summary: Create an exercise
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ExerciseCreateDto'
   *     responses:
   *       201:
   *         description: Exercise created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/ExerciseResponseDto'
   */
  const createExerciseController = async (req, res, next) => {
    try {
      const payload = ExerciseCreateDto.parse(req.body);
      const result = await createExercise(payload, req.auth.userId);
      res.status(201).json({
        message: "Exercise created",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/workout/exercises:
   *   get:
   *     tags:
   *       - Exercises
   *     summary: List exercises
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: gender
   *         schema:
   *           type: string
   *           enum: [MALE, FEMALE]
   *       - in: query
   *         name: bodyType
   *         schema:
   *           type: string
   *           enum: [ECTO, ENDO]
   *       - in: query
   *         name: workoutType
   *         schema:
   *           type: string
   *       - in: query
   *         name: muscleGroup
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of exercises
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ExerciseResponseDto'
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
   * /api/workout/exercises/{id}:
   *   get:
   *     tags:
   *       - Exercises
   *     summary: Get exercise by id
   *     security:
   *       - bearerAuth: []
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
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/ExerciseResponseDto'
   *       404:
   *         description: Not found
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
   * /api/workout/exercises/{id}:
   *   put:
   *     tags:
   *       - Exercises
   *     summary: Update an exercise
   *     security:
   *       - bearerAuth: []
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
   *             $ref: '#/components/schemas/ExerciseUpdateDto'
   *     responses:
   *       200:
   *         description: Exercise updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/ExerciseResponseDto'
   */
  const updateExerciseController = async (req, res, next) => {
    try {
      const payload = ExerciseUpdateDto.parse({ ...req.body, id: req.params.id });
      const result = await updateExercise(payload, req.auth.userId);
      res.json({ message: "Exercise updated", data: result });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/workout/exercises/{id}:
   *   delete:
   *     tags:
   *       - Exercises
   *     summary: Delete an exercise
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Deleted
   */
  const deleteExerciseController = async (req, res, next) => {
    try {
      await deleteExercise(req.params.id, req.auth.userId);
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