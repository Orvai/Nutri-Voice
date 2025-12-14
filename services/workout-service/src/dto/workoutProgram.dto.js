const { z } = require("zod");

/* ============================================
   WORKOUT EXERCISE ITEM DTOs
============================================ */

const WorkoutExerciseItemCreateDto = z
  .object({
    exerciseId: z.string(),
    sets: z.number().int().positive(),
    reps: z.string(),
    weight: z.number().nullable().optional(),
    rest: z.number().int().nullable().optional(),
    order: z.number().int().nonnegative(),
    notes: z.string().nullable().optional(),
  })
  .strict();

const WorkoutExerciseItemUpdateDto = z
  .object({
    id: z.string(),
    exerciseId: z.string().optional(),
    sets: z.number().int().positive().optional(),
    reps: z.string().optional(),
    weight: z.number().nullable().optional(),
    rest: z.number().int().nullable().optional(),
    order: z.number().int().nonnegative().optional(),
    notes: z.string().nullable().optional(),
  })
  .strict();

const WorkoutExerciseItemDeleteDto = z
  .object({
    id: z.string(),
  })
  .strict();

/* ============================================
   WORKOUT PROGRAM CREATE DTO
============================================ */

/**
 * When creating a program:
 * - "templateId" is optional (if created FROM a template)
 * - "exercises" can be empty (default [])
 */
const WorkoutProgramCreateRequestDto = z
  .object({
    name: z.string().min(2),
    clientId: z.string(),
    coachId: z.string(),

    templateId: z.string().optional(),

    exercises: z.array(WorkoutExerciseItemCreateDto).optional().default([]),
  })
  .strict();

/* ============================================
   WORKOUT PROGRAM UPDATE DTO
============================================ */

const WorkoutProgramUpdateRequestDto = z
  .object({
    name: z.string().optional(),

    exercisesToAdd: z.array(WorkoutExerciseItemCreateDto).optional(),
    exercisesToUpdate: z.array(WorkoutExerciseItemUpdateDto).optional(),
    exercisesToDelete: z.array(WorkoutExerciseItemDeleteDto).optional(),
  })
  .strict();

const WorkoutProgramIdParamDto = z.object({
  id: z.string(),
}).strict();

const WorkoutProgramListQueryDto = z
  .object({
    clientId: z.string().optional(),
    coachId: z.string().optional(),
  })
  .strict();

/* ============================================
   RESPONSE DTOs
============================================ */

const WorkoutExerciseResponseDto = z.object({
  id: z.string(),
  programId: z.string(),
  exerciseId: z.string(),
  sets: z.number(),
  reps: z.string(),
  weight: z.number().nullable(),
  rest: z.number().nullable(),
  order: z.number(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const WorkoutProgramResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  clientId: z.string(),
  coachId: z.string(),

  // NEW: return templateId as well
  templateId: z.string().nullable().optional(),

  createdAt: z.date(),
  updatedAt: z.date(),

  exercises: z.array(WorkoutExerciseResponseDto),
});

module.exports = {
  WorkoutExerciseItemCreateDto,
  WorkoutExerciseItemUpdateDto,
  WorkoutExerciseItemDeleteDto,
  WorkoutProgramCreateRequestDto,
  WorkoutProgramUpdateRequestDto,
  WorkoutProgramIdParamDto,
  WorkoutProgramListQueryDto,
  WorkoutExerciseResponseDto,
  WorkoutProgramResponseDto,
};