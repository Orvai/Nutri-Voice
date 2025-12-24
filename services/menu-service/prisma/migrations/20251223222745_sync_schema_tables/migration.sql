/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ClientMenuMeal` table. All the data in the column will be lost.
  - You are about to drop the column `originalTemplateId` on the `ClientMenuMeal` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ClientMenuMeal` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ClientMenuMealOption` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ClientMenuMealOption` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ClientMenuVitamin` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ClientMenuVitamin` table. All the data in the column will be lost.
  - You are about to drop the column `proteinPer100g` on the `FoodItem` table. All the data in the column will be lost.
  - You are about to drop the column `totalCalories` on the `MealTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `MealTemplateItem` table. All the data in the column will be lost.
  - You are about to drop the column `defaultCalories` on the `MealTemplateItem` table. All the data in the column will be lost.
  - You are about to drop the column `defaultGrams` on the `MealTemplateItem` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `MealTemplateItem` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `TemplateMenuMeal` table. All the data in the column will be lost.
  - You are about to drop the column `selectedOptionId` on the `TemplateMenuMeal` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TemplateMenuMeal` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `TemplateMenuMealOption` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TemplateMenuMealOption` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `TemplateMenuVitamin` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TemplateMenuVitamin` table. All the data in the column will be lost.
  - You are about to drop the `ClientMenuMealItem` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `category` on table `FoodItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `caloriesPer100g` on table `FoodItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalCalories` on table `TemplateMenuMeal` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ClientMenuMeal" DROP CONSTRAINT "ClientMenuMeal_originalTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "ClientMenuMealItem" DROP CONSTRAINT "ClientMenuMealItem_clientMenuMealId_fkey";

-- DropForeignKey
ALTER TABLE "ClientMenuMealItem" DROP CONSTRAINT "ClientMenuMealItem_foodItemId_fkey";

-- DropForeignKey
ALTER TABLE "ClientMenuVitamin" DROP CONSTRAINT "ClientMenuVitamin_vitaminId_fkey";

-- DropForeignKey
ALTER TABLE "TemplateMenuVitamin" DROP CONSTRAINT "TemplateMenuVitamin_vitaminId_fkey";

-- DropIndex
DROP INDEX "ClientMenu_originalTemplateMenuId_idx";

-- DropIndex
DROP INDEX "ClientMenuMeal_originalTemplateId_idx";

-- AlterTable
ALTER TABLE "ClientMenuMeal" DROP COLUMN "createdAt",
DROP COLUMN "originalTemplateId",
DROP COLUMN "updatedAt",
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "totalCalories" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ClientMenuMealOption" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "mealTemplateId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ClientMenuVitamin" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "FoodItem" DROP COLUMN "proteinPer100g",
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "caloriesPer100g" SET NOT NULL;

-- AlterTable
ALTER TABLE "MealTemplate" DROP COLUMN "totalCalories";

-- AlterTable
ALTER TABLE "MealTemplateItem" DROP COLUMN "createdAt",
DROP COLUMN "defaultCalories",
DROP COLUMN "defaultGrams",
DROP COLUMN "notes",
ADD COLUMN     "grams" DOUBLE PRECISION NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE "TemplateMenuMeal" DROP COLUMN "createdAt",
DROP COLUMN "selectedOptionId",
DROP COLUMN "updatedAt",
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "totalCalories" SET NOT NULL;

-- AlterTable
ALTER TABLE "TemplateMenuMealOption" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "TemplateMenuVitamin" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "ClientMenuMealItem";

-- DropEnum
DROP TYPE "MealSlot";

-- CreateTable
CREATE TABLE "ClientMenuMealOptionItem" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "foodItemId" TEXT NOT NULL,
    "role" "MealItemRole" NOT NULL,
    "grams" DOUBLE PRECISION NOT NULL DEFAULT 100,

    CONSTRAINT "ClientMenuMealOptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClientMenuMealOptionItem_optionId_idx" ON "ClientMenuMealOptionItem"("optionId");

-- CreateIndex
CREATE INDEX "ClientMenuMealOptionItem_foodItemId_idx" ON "ClientMenuMealOptionItem"("foodItemId");

-- AddForeignKey
ALTER TABLE "TemplateMenuVitamin" ADD CONSTRAINT "TemplateMenuVitamin_vitaminId_fkey" FOREIGN KEY ("vitaminId") REFERENCES "VitaminMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientMenuMealOptionItem" ADD CONSTRAINT "ClientMenuMealOptionItem_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "ClientMenuMealOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientMenuMealOptionItem" ADD CONSTRAINT "ClientMenuMealOptionItem_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientMenuVitamin" ADD CONSTRAINT "ClientMenuVitamin_vitaminId_fkey" FOREIGN KEY ("vitaminId") REFERENCES "VitaminMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
