-- Add per-menu weekly allowance for day-type usage (0-7)
ALTER TABLE "ClientMenu"
ADD COLUMN "allowedDaysPerWeek" INTEGER NOT NULL DEFAULT 7;

ALTER TABLE "ClientMenu"
ADD CONSTRAINT "ClientMenu_allowedDaysPerWeek_check"
CHECK ("allowedDaysPerWeek" >= 0 AND "allowedDaysPerWeek" <= 7);
