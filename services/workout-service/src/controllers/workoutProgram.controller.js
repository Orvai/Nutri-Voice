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
 * /internal/workout/programs:
 *   post:
 *     tags:
 *       - Workout - Programs
 *     summary: Create a workout program (internal)
 *     security:
 *       - internalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Workout_WorkoutProgramCreateRequestDto'
 *     responses:
 *       201:
 *         description: Workout program created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout_WorkoutProgramResponseDto'
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
 * @openapi
 * /internal/workout/programs:
 *   get:
 *     tags:
 *       - Workout - Programs
 *     summary: List workout programs (internal)
 *     security:
 *       - internalToken: []
 *     responses:
 *       200:
 *         description: Workout programs list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workout_WorkoutProgramResponseDto'
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
 * @openapi
 * /internal/workout/programs/{id}:
 *   get:
 *     tags:
 *       - Workout - Programs
 *     summary: Get a workout program by ID (internal)
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
 *         description: Workout program details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout_WorkoutProgramResponseDto'
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
 * @openapi
 * /internal/workout/programs/{id}:
 *   put:
 *     tags:
 *       - Workout - Programs
 *     summary: Update a workout program (internal)
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
 *             $ref: '#/components/schemas/Workout_WorkoutProgramUpdateRequestDto'
 *     responses:
 *       200:
 *         description: Updated workout program
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout_WorkoutProgramResponseDto'
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
 * @openapi
 * /internal/workout/programs/{id}:
 *   delete:
 *     tags:
 *       - Workout - Programs
 *     summary: Delete a workout program (internal)
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
 *         description: Workout program deleted
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
