const {
  createWorkoutLog,
  listAllWorkouts,
  updateWorkoutLog,
  updateExerciseWeight
} = require('../services/workoutLog.service');

const {
  WorkoutLogCreateDto,
  WorkoutLogUpdateDto,
  WorkoutLogResponseDto,
  WorkoutHistoryResponseDto
} = require('../dto/workoutLog.dto');

/**
 * @openapi
 * /api/tracking/workout-log:
 *   post:
 *     tags:
 *       - Tracking
 *     summary: Log a new workout
 *     description: Authenticated client records a workout + exercises.
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
 *         description: Workout logged successfully
 */
const createWorkout = async (req, res, next) => {
  try {
    const payload = WorkoutLogCreateDto.parse(req.body);
    const clientId = req.user.id;

    const data = await createWorkoutLog({ ...payload, clientId });

    res.status(201).json({
      message: 'Workout logged',
      data: WorkoutLogResponseDto.parse(data)
    });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/tracking/workout-log/history/{clientId}:
 *   get:
 *     tags:
 *       - Tracking
 *     summary: Get workout history for a client
 *     description: Returns all workouts + exercises.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
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

    res.json({
      data: WorkoutHistoryResponseDto.parse(data)
    });
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
 *     summary: Update workout log
 *     description: Updates workout type, notes, effort level, and exercises.
 *     security:
 *       - internalToken: []
 *     parameters:
 *       - name: logId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout updated successfully
 */
const updateWorkout = async (req, res, next) => {
  try {
    const { logId } = req.params;
    const payload = WorkoutLogUpdateDto.parse(req.body);

    const data = await updateWorkoutLog(logId, payload);

    res.json({
      message: 'Workout updated',
      data: WorkoutLogResponseDto.parse(data)
    });
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
 *     summary: Update exercise weight
 *     description: Updates a single logged exercise's weight.
 *     security:
 *       - internalToken: []
 *     parameters:
 *       - name: exerciseLogId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exercise updated successfully
 */
const updateExercise = async (req, res, next) => {
  try {
    const { exerciseLogId } = req.params;
    const { weight } = req.body;

    const data = await updateExerciseWeight(exerciseLogId, weight);

    res.json({
      message: 'Exercise updated',
      data // could validate with WorkoutExerciseResponseDto if needed
    });
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
