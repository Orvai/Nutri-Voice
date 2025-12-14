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
  WorkoutProgramIdParamDto,
  WorkoutProgramListQueryDto,
} = require("../dto/workoutProgram.dto");

const createProgramController = async (req, res, next) => {
  try {
    const payload = WorkoutProgramCreateRequestDto.parse(req.body);
    const result = await createProgram(payload);
    res.status(201).json({ message: "Workout program created", data: result });
  } catch (e) {
    next(e);
  }
};

const listProgramsController = async (req, res, next) => {
  try {
    const query = WorkoutProgramListQueryDto.parse(req.query);
    const result = await listPrograms(query);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

const getProgramController = async (req, res, next) => {
  try {
    const { id } = WorkoutProgramIdParamDto.parse(req.params);
    const result = await getProgramById(id);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

const updateProgramController = async (req, res, next) => {
  try {
    const { id } = WorkoutProgramIdParamDto.parse(req.params);
    const payload = WorkoutProgramUpdateRequestDto.parse(req.body);
    const result = await updateProgram(id, payload);
    res.json({ message: "Workout program updated", data: result });
  } catch (e) {
    next(e);
  }
};

const deleteProgramController = async (req, res, next) => {
  try {
    const { id } = WorkoutProgramIdParamDto.parse(req.params);
    await deleteProgram(id);
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
