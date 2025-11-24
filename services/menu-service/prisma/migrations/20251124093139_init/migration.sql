-- CreateEnum
CREATE TYPE "DayType" AS ENUM ('TRAINING', 'REST');

-- CreateEnum
CREATE TYPE "MealSlot" AS ENUM ('MEAL1', 'MEAL2', 'MEAL3', 'CARB_LOAD');

-- CreateEnum
CREATE TYPE "MealTemplateKind" AS ENUM ('MEAT_MEAL', 'DAIRY_MEAL', 'FREE_CALORIES', 'CARB_LOAD');

-- CreateEnum
CREATE TYPE "MealItemRole" AS ENUM ('PROTEIN', 'CARB', 'FREE', 'HEALTH', 'MENTAL_HEALTH');

-- CreateTable
CREATE TABLE "FoodItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "caloriesPer100g" DOUBLE PRECISION,
    "proteinPer100g" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoodItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "MealTemplateKind" NOT NULL,
    "coachId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealTemplateItem" (
    "id" TEXT NOT NULL,
    "foodItemId" TEXT NOT NULL,
    "mealTemplateId" TEXT NOT NULL,
    "role" "MealItemRole" NOT NULL,
    "defaultGrams" DOUBLE PRECISION,
    "defaultCalories" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealTemplateItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyMenuTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dayType" "DayType" NOT NULL,
    "coachId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyMenuTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyMenuMeal" (
    "id" TEXT NOT NULL,
    "slot" "MealSlot" NOT NULL,
    "maxCalories" DOUBLE PRECISION,
    "mealTemplateId" TEXT,
    "dailyMenuTemplateId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyMenuMeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientMenu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "dailyMenuTemplateId" TEXT,
    "structureJson" JSONB,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientMenu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MealTemplateItem_mealTemplateId_idx" ON "MealTemplateItem"("mealTemplateId");

-- CreateIndex
CREATE INDEX "MealTemplateItem_foodItemId_idx" ON "MealTemplateItem"("foodItemId");

-- CreateIndex
CREATE INDEX "DailyMenuMeal_dailyMenuTemplateId_idx" ON "DailyMenuMeal"("dailyMenuTemplateId");

-- CreateIndex
CREATE INDEX "DailyMenuMeal_mealTemplateId_idx" ON "DailyMenuMeal"("mealTemplateId");

-- CreateIndex
CREATE INDEX "ClientMenu_clientId_isActive_idx" ON "ClientMenu"("clientId", "isActive");

-- CreateIndex
CREATE INDEX "ClientMenu_coachId_idx" ON "ClientMenu"("coachId");

-- AddForeignKey
ALTER TABLE "MealTemplateItem" ADD CONSTRAINT "MealTemplateItem_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealTemplateItem" ADD CONSTRAINT "MealTemplateItem_mealTemplateId_fkey" FOREIGN KEY ("mealTemplateId") REFERENCES "MealTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyMenuMeal" ADD CONSTRAINT "DailyMenuMeal_dailyMenuTemplateId_fkey" FOREIGN KEY ("dailyMenuTemplateId") REFERENCES "DailyMenuTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyMenuMeal" ADD CONSTRAINT "DailyMenuMeal_mealTemplateId_fkey" FOREIGN KEY ("mealTemplateId") REFERENCES "MealTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientMenu" ADD CONSTRAINT "ClientMenu_dailyMenuTemplateId_fkey" FOREIGN KEY ("dailyMenuTemplateId") REFERENCES "DailyMenuTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
