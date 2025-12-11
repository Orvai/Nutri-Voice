-- AlterTable
ALTER TABLE "WorkoutProgram" ADD COLUMN     "templateId" TEXT;

-- AddForeignKey
ALTER TABLE "WorkoutProgram" ADD CONSTRAINT "WorkoutProgram_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "WorkoutTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
