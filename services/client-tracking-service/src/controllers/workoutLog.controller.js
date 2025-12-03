const {
  createWorkoutLog,
  listAllWorkouts,
  updateWorkoutLog,
  updateExerciseWeight
} = require('../services/workoutLog.service');

const {
  WorkoutLogCreateDto,
  WorkoutLogUpdateDto
} = require('../dto/workoutLog.dto');


/**
 * @openapi
 * /api/tracking/workout-log:
 *   post:
 *     tags:
 *       - Tracking
 *     summary: Log a new workout for a client
 *     description: Creates a workout log + list of exercises performed with weights.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutLogCreateDto'
 *     responses:
 *       201:
 *         description: Workout successfully logged
 */
const createWorkout = async (req, res, next) => {
  try {
    const { clientId, ...payload } = WorkoutLogCreateDto.parse(req.body);
    const data = await createWorkoutLog({ ...payload, clientId });

    res.status(201).json({ message: 'Workout logged', data });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/tracking/workout-log/history:
 *   get:
 *     tags:
 *       - Tracking
 *     summary: Get full workout history for a client
 *     description: Returns all workouts + all exercises + weights.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: clientId
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Full workout history
 */
const history = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const data = await listAllWorkouts(clientId);

    res.json({ data });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/tracking/workout-log/{logId}:
 *   put:
 *     tags:
 *       - Tracking
 *     summary: Update a full workout log
 *     description: Update workout type, effort level, notes, and exercise list.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: logId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutLogUpdateDto'
 *     responses:
 *       200:
 *         description: Workout updated
 */
const updateWorkout = async (req, res, next) => {
  try {
    const { logId } = req.params;
    const payload = WorkoutLogUpdateDto.parse(req.body);

    const data = await updateWorkoutLog(logId, payload);

    res.json({ message: 'Workout updated', data });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/tracking/workout-log/exercise/{exerciseLogId}:
 *   patch:
 *     tags:
 *       - Tracking
 *     summary: Update a single exercise entry (weight)
 *     description: Allows correcting or updating weight for a single logged exercise.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: exerciseLogId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weight:
 *                 type: number
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Exercise updated
 */
const updateExercise = async (req, res, next) => {
  try {
    const { exerciseLogId } = req.params;
    const { weight } = req.body;

    const data = await updateExerciseWeight(exerciseLogId, weight);

    res.json({ message: 'Exercise updated', data });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createWorkout,
  history,
  updateWorkout,
  updateExercise
};
