-- Add missing effortLevel column used by workout tracking endpoints
ALTER TABLE "WorkoutLog"
ADD COLUMN "effortLevel" "EffortLevel" NOT NULL DEFAULT 'NORMAL';
