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
CREATE TABLE "VitaminMaster" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VitaminMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "MealTemplateKind" NOT NULL,
    "coachId" TEXT NOT NULL,
    "totalCalories" DOUBLE PRECISION NOT NULL DEFAULT 0,
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
    "defaultGrams" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "defaultCalories" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealTemplateItem_pkey" PRIMARY KEY ("id")
);

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
    "vitaminId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateMenuVitamin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientMenu" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DayType" NOT NULL,
    "totalCalories" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "originalTemplateMenuId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientMenu_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "ClientMenuVitamin" (
    "id" TEXT NOT NULL,
    "clientMenuId" TEXT NOT NULL,
    "vitaminId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientMenuVitamin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MealTemplateItem_mealTemplateId_idx" ON "MealTemplateItem"("mealTemplateId");

-- CreateIndex
CREATE INDEX "MealTemplateItem_foodItemId_idx" ON "MealTemplateItem"("foodItemId");

-- CreateIndex
CREATE INDEX "TemplateMenuMeal_templateMenuId_idx" ON "TemplateMenuMeal"("templateMenuId");

-- CreateIndex
CREATE INDEX "TemplateMenuMealOption_mealId_idx" ON "TemplateMenuMealOption"("mealId");

-- CreateIndex
CREATE INDEX "TemplateMenuVitamin_templateMenuId_idx" ON "TemplateMenuVitamin"("templateMenuId");

-- CreateIndex
CREATE INDEX "TemplateMenuVitamin_vitaminId_idx" ON "TemplateMenuVitamin"("vitaminId");

-- CreateIndex
CREATE INDEX "ClientMenu_clientId_isActive_idx" ON "ClientMenu"("clientId", "isActive");

-- CreateIndex
CREATE INDEX "ClientMenu_coachId_idx" ON "ClientMenu"("coachId");

-- CreateIndex
CREATE INDEX "ClientMenu_originalTemplateMenuId_idx" ON "ClientMenu"("originalTemplateMenuId");

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
CREATE INDEX "ClientMenuVitamin_clientMenuId_idx" ON "ClientMenuVitamin"("clientMenuId");

-- CreateIndex
CREATE INDEX "ClientMenuVitamin_vitaminId_idx" ON "ClientMenuVitamin"("vitaminId");

-- AddForeignKey
ALTER TABLE "MealTemplateItem" ADD CONSTRAINT "MealTemplateItem_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealTemplateItem" ADD CONSTRAINT "MealTemplateItem_mealTemplateId_fkey" FOREIGN KEY ("mealTemplateId") REFERENCES "MealTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateMenuMeal" ADD CONSTRAINT "TemplateMenuMeal_templateMenuId_fkey" FOREIGN KEY ("templateMenuId") REFERENCES "TemplateMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateMenuMealOption" ADD CONSTRAINT "TemplateMenuMealOption_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "TemplateMenuMeal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateMenuMealOption" ADD CONSTRAINT "TemplateMenuMealOption_mealTemplateId_fkey" FOREIGN KEY ("mealTemplateId") REFERENCES "MealTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateMenuVitamin" ADD CONSTRAINT "TemplateMenuVitamin_templateMenuId_fkey" FOREIGN KEY ("templateMenuId") REFERENCES "TemplateMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateMenuVitamin" ADD CONSTRAINT "TemplateMenuVitamin_vitaminId_fkey" FOREIGN KEY ("vitaminId") REFERENCES "VitaminMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "ClientMenuVitamin" ADD CONSTRAINT "ClientMenuVitamin_clientMenuId_fkey" FOREIGN KEY ("clientMenuId") REFERENCES "ClientMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientMenuVitamin" ADD CONSTRAINT "ClientMenuVitamin_vitaminId_fkey" FOREIGN KEY ("vitaminId") REFERENCES "VitaminMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;
