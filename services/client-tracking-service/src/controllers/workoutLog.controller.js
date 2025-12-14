const { z } = require('zod');
const {
  createWorkoutLog,
  listAllWorkouts,
  updateWorkoutLog,
  updateExerciseWeight
} = require('../services/workoutLog.service');

const {
  WorkoutLogCreateDto,
  WorkoutLogUpdateDto,
  WorkoutExerciseWeightDto,
  WorkoutLogResponseDto,
  WorkoutHistoryResponseDto,
  WorkoutExerciseResponseDto
} = require('../dto/workoutLog.dto');

const ClientIdParamsDto = z.object({ clientId: z.string().min(1) }).strict();
const WorkoutLogParamsDto = z.object({ logId: z.string().min(1) }).strict();
const ExerciseLogParamsDto = z.object({ exerciseLogId: z.string().min(1) }).strict();

const createWorkout = async (req, res, next) => {
  try {
    const payload = WorkoutLogCreateDto.parse(req.body);
    const clientId = req.user.id;

    const data = await createWorkoutLog(clientId, payload);

    res.status(201).json({
      message: 'Workout logged',
      data: WorkoutLogResponseDto.parse(data)
    });
  } catch (e) {
    next(e);
  }
};

const history = async (req, res, next) => {
  try {
    const { clientId } = ClientIdParamsDto.parse(req.params);

    const data = await listAllWorkouts(clientId);

    res.json({
      data: WorkoutHistoryResponseDto.parse(data)
    });
  } catch (e) {
    next(e);
  }
};

const updateWorkout = async (req, res, next) => {
  try {
    const { logId } = WorkoutLogParamsDto.parse(req.params);
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

const updateExercise = async (req, res, next) => {
  try {
    const { exerciseLogId } = ExerciseLogParamsDto.parse(req.params);
    const { weight } = WorkoutExerciseWeightDto.parse(req.body);

    const data = await updateExerciseWeight(exerciseLogId, weight);

    res.json({
      message: 'Exercise updated',
      data: WorkoutExerciseResponseDto.parse(data)
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
