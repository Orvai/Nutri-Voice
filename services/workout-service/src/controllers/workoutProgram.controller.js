// src/controllers/workoutProgram.controller.js
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
   * @openapi
   * /api/workout/programs:
   *   post:
   *     tags:
   *       - WorkoutPrograms
   *     summary: Create a workout program for a client
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/WorkoutProgramCreateRequestDto'
   *     responses:
   *       201:
   *         description: Workout program created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/WorkoutProgramResponseDto'
   */
  const createProgramController = async (req, res, next) => {
    try {
      const payload = WorkoutProgramCreateRequestDto.parse(req.body);
      const result = await createProgram(payload, req.auth);
      res.status(201).json({ message: "Workout program created", data: result });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/workout/programs:
   *   get:
   *     tags:
   *       - WorkoutPrograms
   *     summary: List workout programs
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: clientId
   *         required: false
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of programs
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/WorkoutProgramResponseDto'
   */
  const listProgramsController = async (req, res, next) => {
    try {
      const result = await listPrograms(req.query, req.auth);
      res.json({ data: result });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/workout/programs/{id}:
   *   get:
   *     tags:
   *       - WorkoutPrograms
   *     summary: Get a workout program by id
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
   *         description: Program details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/WorkoutProgramResponseDto'
   */
  const getProgramController = async (req, res, next) => {
    try {
      const result = await getProgramById(req.params.id, req.auth);
      res.json({ data: result });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/workout/programs/{id}:
   *   put:
   *     tags:
   *       - WorkoutPrograms
   *     summary: Update a workout program
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
   *             $ref: '#/components/schemas/WorkoutProgramUpdateRequestDto'
   *     responses:
   *       200:
   *         description: Program updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/WorkoutProgramResponseDto'
   */
  const updateProgramController = async (req, res, next) => {
    try {
      const payload = WorkoutProgramUpdateRequestDto.parse(req.body);
      const result = await updateProgram(req.params.id, payload, req.auth);
      res.json({ message: "Workout program updated", data: result });
    } catch (e) {
      next(e);
    }
  };
  
  /**
   * @openapi
   * /api/workout/programs/{id}:
   *   delete:
   *     tags:
   *       - WorkoutPrograms
   *     summary: Delete a workout program
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
  const deleteProgramController = async (req, res, next) => {
    try {
      await deleteProgram(req.params.id, req.auth);
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