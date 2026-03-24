import type {
  ActiveWorkoutSessionDto,
  WorkoutProgramDto,
  WorkoutSummaryDto
} from "@/types/workout/workout.dto";
import type {
  ActiveWorkoutSession,
  WorkoutProgram,
  WorkoutProgramDetails,
  WorkoutSummary
} from "@/types/workout/workout.ui";
import { formatTime } from "@/utils/format";

const intensityLabels: Record<WorkoutProgramDto["intensity"], string> = {
  low: "עצימות נמוכה",
  medium: "עצימות בינונית",
  high: "עצימות גבוהה"
};

const nextActionLabels: Record<WorkoutSummaryDto["nextBestAction"], string> = {
  report_meal: "דווח ארוחה כדי להשלים את היום",
  hydrate: "שתה מים ועבור להתאוששות"
};

const mapProgramBase = (dto: WorkoutProgramDto): WorkoutProgram => ({
  id: dto.id,
  title: dto.title,
  category: dto.category,
  durationLabel: `${dto.durationMinutes} דק׳`,
  intensityLabel: intensityLabels[dto.intensity],
  isToday: dto.isToday,
  thumbnailUrl: dto.thumbnailUrl,
  exercisesCount: dto.exercises.length
});

export const mapWorkoutProgramToUI = (dto: WorkoutProgramDto): WorkoutProgram =>
  mapProgramBase(dto);

export const mapWorkoutDetailsToUI = (
  dto: WorkoutProgramDto
): WorkoutProgramDetails => ({
  ...mapProgramBase(dto),
  exercises: dto.exercises
});

export const mapActiveWorkoutToUI = (
  dto: ActiveWorkoutSessionDto,
  restSecondsRemaining: number
): ActiveWorkoutSession => {
  const totalSets = dto.exerciseLogs.reduce(
    (acc, exercise) => acc + exercise.sets.length,
    0
  );

  const completedSets = dto.exerciseLogs.reduce(
    (acc, exercise) =>
      acc + exercise.sets.reduce((sum, set) => sum + (set.completed ? 1 : 0), 0),
    0
  );

  return {
    programId: dto.programId,
    startedAtLabel: formatTime(dto.startedAtIso),
    restSecondsRemaining,
    completedSets,
    totalSets,
    exerciseLogs: dto.exerciseLogs
  };
};

export const mapWorkoutSummaryToUI = (dto: WorkoutSummaryDto): WorkoutSummary => ({
  programId: dto.programId,
  completedAtLabel: formatTime(dto.completedAtIso),
  totalSetsCompleted: dto.totalSetsCompleted,
  totalVolumeKg: dto.totalVolumeKg,
  durationMinutes: dto.durationMinutes,
  effortLabel: dto.effortLabel,
  nextBestActionLabel: nextActionLabels[dto.nextBestAction]
});
