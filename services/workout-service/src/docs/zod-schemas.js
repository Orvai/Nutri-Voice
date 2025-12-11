const { z } = require('zod');
const { ExerciseCreateDto, ExerciseUpdateDto, ExerciseResponseDto } = require('../dto/exercise.dto');
const { WorkoutTemplateResponseDto } = require('../dto/workoutTemplate.dto');
const { WorkoutProgramCreateRequestDto, WorkoutProgramUpdateRequestDto, WorkoutProgramResponseDto, WorkoutExerciseResponseDto } = require('../dto/workoutProgram.dto');

function toJsonSchema(name, schema) {
  const json = z.toJSONSchema(schema, {
    unrepresentable: 'any',
    override: (ctx) => {
      const def = ctx.zodSchema?._zod?.def;
      if (def && def.type === 'date') {
        ctx.jsonSchema.type = 'string';
        ctx.jsonSchema.format = 'date-time';
      }
    },
  });
  return { title: name, ...json };
}

const schemas = {
  // Requests
  Workout_ExerciseCreateDto: ExerciseCreateDto,
  Workout_ExerciseUpdateDto: ExerciseUpdateDto,
  Workout_WorkoutProgramCreateRequestDto: WorkoutProgramCreateRequestDto,
  Workout_WorkoutProgramUpdateRequestDto: WorkoutProgramUpdateRequestDto,

  // Responses
  Workout_ExerciseResponseDto: ExerciseResponseDto,
  Workout_WorkoutTemplateResponseDto: WorkoutTemplateResponseDto,
  Workout_WorkoutProgramResponseDto: WorkoutProgramResponseDto,
  Workout_WorkoutExerciseResponseDto: WorkoutExerciseResponseDto,
};

module.exports = Object.entries(schemas).reduce((acc, [name, schema]) => {
  acc[name] = toJsonSchema(name, schema);
  return acc;
}, {});
