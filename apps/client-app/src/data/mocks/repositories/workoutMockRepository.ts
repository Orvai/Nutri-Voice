import { getMockState, updateMockState } from "@/data/mocks/mockStore";
import { mockRequest } from "@/data/mocks/mockRequest";
import type {
  ActiveWorkoutSessionDto,
  UpdateWorkoutSetInputDto,
  WorkoutProgramDto,
  WorkoutSummaryDto
} from "@/types/workout/workout.dto";

const createSessionFromProgram = (
  program: WorkoutProgramDto
): ActiveWorkoutSessionDto => ({
  programId: program.id,
  startedAtIso: new Date().toISOString(),
  restEndsAtIso: null,
  exerciseLogs: program.exercises.map((exercise) => ({
    exerciseId: exercise.id,
    name: exercise.name,
    restSeconds: exercise.restSeconds,
    sets: Array.from({ length: exercise.sets }, (_, index) => ({
      setNumber: index + 1,
      reps: exercise.reps,
      weightKg: exercise.suggestedWeightKg,
      completed: false
    }))
  }))
});

export const getRestSecondsRemaining = (restEndsAtIso: string | null): number => {
  if (!restEndsAtIso) {
    return 0;
  }

  const diffMs = new Date(restEndsAtIso).getTime() - Date.now();
  if (diffMs <= 0) {
    return 0;
  }

  return Math.ceil(diffMs / 1000);
};

export async function getWorkoutPrograms(): Promise<WorkoutProgramDto[]> {
  return mockRequest("workout", () => getMockState().workout.programs);
}

export async function getWorkoutProgramById(
  programId: string
): Promise<WorkoutProgramDto | null> {
  return mockRequest("workout", () => {
    return (
      getMockState().workout.programs.find((program) => program.id === programId) ??
      null
    );
  });
}

export async function startWorkout(
  programId: string
): Promise<ActiveWorkoutSessionDto> {
  return mockRequest("workout", () => {
    const state = getMockState();
    const active = state.workout.activeSessions[programId];

    if (active) {
      return active;
    }

    const program = state.workout.programs.find((item) => item.id === programId);
    if (!program) {
      throw new Error("האימון לא נמצא");
    }

    updateMockState((draft) => {
      draft.workout.activeSessions[programId] = createSessionFromProgram(program);
    });

    const nextState = getMockState();
    const nextSession = nextState.workout.activeSessions[programId];
    if (!nextSession) {
      throw new Error("לא הצלחנו להתחיל את האימון");
    }

    return nextSession;
  });
}

export async function getActiveWorkout(
  programId: string
): Promise<ActiveWorkoutSessionDto | null> {
  return mockRequest("workout", () => {
    const session = getMockState().workout.activeSessions[programId] ?? null;
    if (!session) {
      return null;
    }

    if (session.restEndsAtIso && getRestSecondsRemaining(session.restEndsAtIso) === 0) {
      updateMockState((draft) => {
        const active = draft.workout.activeSessions[programId];
        if (active) {
          active.restEndsAtIso = null;
        }
      });

      return getMockState().workout.activeSessions[programId] ?? null;
    }

    return session;
  });
}

export async function updateWorkoutSet(
  payload: UpdateWorkoutSetInputDto
): Promise<ActiveWorkoutSessionDto> {
  return mockRequest("workout", () => {
    updateMockState((draft) => {
      const session = draft.workout.activeSessions[payload.programId];
      if (!session) {
        throw new Error("אין אימון פעיל לעדכון");
      }

      const exercise = session.exerciseLogs.find(
        (item) => item.exerciseId === payload.exerciseId
      );

      if (!exercise) {
        throw new Error("תרגיל לא נמצא באימון הפעיל");
      }

      const set = exercise.sets.find((item) => item.setNumber === payload.setNumber);
      if (!set) {
        throw new Error("סט לא נמצא");
      }

      set.reps = payload.reps;
      set.weightKg = payload.weightKg;
      set.completed = true;
      session.restEndsAtIso = new Date(
        Date.now() + exercise.restSeconds * 1000
      ).toISOString();
    });

    const updated = getMockState().workout.activeSessions[payload.programId];
    if (!updated) {
      throw new Error("שמירת הסט נכשלה");
    }

    return updated;
  });
}

export async function finishWorkout(
  programId: string
): Promise<WorkoutSummaryDto> {
  return mockRequest("workout", () => {
    const state = getMockState();
    const session = state.workout.activeSessions[programId];
    if (!session) {
      throw new Error("אין אימון פעיל לסיום");
    }

    const completedSets = session.exerciseLogs.reduce(
      (acc, exercise) =>
        acc + exercise.sets.reduce((sum, set) => sum + (set.completed ? 1 : 0), 0),
      0
    );

    const totalVolumeKg = session.exerciseLogs.reduce(
      (acc, exercise) =>
        acc +
        exercise.sets.reduce(
          (sum, set) =>
            sum + (set.completed ? set.reps * Math.max(0, set.weightKg) : 0),
          0
        ),
      0
    );

    const startedAt = new Date(session.startedAtIso).getTime();
    const durationMinutes = Math.max(1, Math.round((Date.now() - startedAt) / 60000));

    const summary: WorkoutSummaryDto = {
      programId,
      completedAtIso: new Date().toISOString(),
      totalSetsCompleted: completedSets,
      totalVolumeKg,
      durationMinutes,
      effortLabel: totalVolumeKg > 5500 ? "גבוה" : totalVolumeKg > 3000 ? "בינוני" : "קל",
      nextBestAction: "report_meal"
    };

    updateMockState((draft) => {
      delete draft.workout.activeSessions[programId];
      draft.workout.summaries[programId] = summary;
    });

    return summary;
  });
}

export async function getWorkoutSummary(
  programId: string
): Promise<WorkoutSummaryDto | null> {
  return mockRequest("workout", () => {
    return getMockState().workout.summaries[programId] ?? null;
  });
}
