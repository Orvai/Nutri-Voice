/*
  Warnings:

  - You are about to drop the column `dailyMenuTemplateId` on the `ClientMenu` table. All the data in the column will be lost.
  - You are about to drop the column `structureJson` on the `ClientMenu` table. All the data in the column will be lost.
  - You are about to drop the `DailyMenuMeal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailyMenuTemplate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `ClientMenu` table without a default value. This is not possible if the table is not empty.
  - Made the column `defaultGrams` on table `MealTemplateItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ClientMenu" DROP CONSTRAINT "ClientMenu_dailyMenuTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "DailyMenuMeal" DROP CONSTRAINT "DailyMenuMeal_dailyMenuTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "DailyMenuMeal" DROP CONSTRAINT "DailyMenuMeal_mealTemplateId_fkey";

-- AlterTable
ALTER TABLE "ClientMenu" DROP COLUMN "dailyMenuTemplateId",
DROP COLUMN "structureJson",
ADD COLUMN     "originalTemplateMenuId" TEXT,
ADD COLUMN     "totalCalories" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "type" "DayType" NOT NULL;

-- AlterTable
ALTER TABLE "MealTemplate" ADD COLUMN     "totalCalories" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "MealTemplateItem" ALTER COLUMN "defaultGrams" SET NOT NULL,
ALTER COLUMN "defaultGrams" SET DEFAULT 100;

-- DropTable
DROP TABLE "DailyMenuMeal";

-- DropTable
DROP TABLE "DailyMenuTemplate";

-- CreateTable
CREATE TABLE "TemplateMenu" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dayType" "DayType" NOT NULL,
    "notes" TEXT,
    "totalCalories" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateMenuMeal" (
    "id" TEXT NOT NULL,
    "templateMenuId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "selectedOptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateMenuMeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateMenuMealOption" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "mealTemplateId" TEXT NOT NULL,
    "name" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateMenuMealOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateMenuVitamin" (
    "id" TEXT NOT NULL,
    "templateMenuId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateMenuVitamin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientMenuMeal" (
    "id" TEXT NOT NULL,
    "clientMenuId" TEXT NOT NULL,
    "originalTemplateId" TEXT,
    "name" TEXT NOT NULL,
    "totalCalories" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "selectedOptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientMenuMeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientMenuMealOption" (
    "id" TEXT NOT NULL,
    "clientMenuMealId" TEXT NOT NULL,
    "mealTemplateId" TEXT NOT NULL,
    "name" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientMenuMealOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientMenuMealItem" (
    "id" TEXT NOT NULL,
    "clientMenuMealId" TEXT NOT NULL,
    "foodItemId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientMenuMealItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TemplateMenuMeal_templateMenuId_idx" ON "TemplateMenuMeal"("templateMenuId");

-- CreateIndex
CREATE INDEX "TemplateMenuMealOption_mealId_idx" ON "TemplateMenuMealOption"("mealId");

-- CreateIndex
CREATE INDEX "TemplateMenuVitamin_templateMenuId_idx" ON "TemplateMenuVitamin"("templateMenuId");

-- CreateIndex
CREATE INDEX "ClientMenuMeal_clientMenuId_idx" ON "ClientMenuMeal"("clientMenuId");

-- CreateIndex
CREATE INDEX "ClientMenuMeal_originalTemplateId_idx" ON "ClientMenuMeal"("originalTemplateId");

-- CreateIndex
CREATE INDEX "ClientMenuMealOption_clientMenuMealId_idx" ON "ClientMenuMealOption"("clientMenuMealId");

-- CreateIndex
CREATE INDEX "ClientMenuMealItem_clientMenuMealId_idx" ON "ClientMenuMealItem"("clientMenuMealId");

-- CreateIndex
CREATE INDEX "ClientMenuMealItem_foodItemId_idx" ON "ClientMenuMealItem"("foodItemId");

-- CreateIndex
CREATE INDEX "ClientMenu_originalTemplateMenuId_idx" ON "ClientMenu"("originalTemplateMenuId");

-- AddForeignKey
ALTER TABLE "TemplateMenuMeal" ADD CONSTRAINT "TemplateMenuMeal_templateMenuId_fkey" FOREIGN KEY ("templateMenuId") REFERENCES "TemplateMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateMenuMealOption" ADD CONSTRAINT "TemplateMenuMealOption_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "TemplateMenuMeal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateMenuMealOption" ADD CONSTRAINT "TemplateMenuMealOption_mealTemplateId_fkey" FOREIGN KEY ("mealTemplateId") REFERENCES "MealTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateMenuVitamin" ADD CONSTRAINT "TemplateMenuVitamin_templateMenuId_fkey" FOREIGN KEY ("templateMenuId") REFERENCES "TemplateMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientMenu" ADD CONSTRAINT "ClientMenu_originalTemplateMenuId_fkey" FOREIGN KEY ("originalTemplateMenuId") REFERENCES "TemplateMenu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientMenuMeal" ADD CONSTRAINT "ClientMenuMeal_clientMenuId_fkey" FOREIGN KEY ("clientMenuId") REFERENCES "ClientMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientMenuMeal" ADD CONSTRAINT "ClientMenuMeal_originalTemplateId_fkey" FOREIGN KEY ("originalTemplateId") REFERENCES "MealTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientMenuMealOption" ADD CONSTRAINT "ClientMenuMealOption_clientMenuMealId_fkey" FOREIGN KEY ("clientMenuMealId") REFERENCES "ClientMenuMeal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientMenuMealOption" ADD CONSTRAINT "ClientMenuMealOption_mealTemplateId_fkey" FOREIGN KEY ("mealTemplateId") REFERENCES "MealTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientMenuMealItem" ADD CONSTRAINT "ClientMenuMealItem_clientMenuMealId_fkey" FOREIGN KEY ("clientMenuMealId") REFERENCES "ClientMenuMeal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientMenuMealItem" ADD CONSTRAINT "ClientMenuMealItem_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
