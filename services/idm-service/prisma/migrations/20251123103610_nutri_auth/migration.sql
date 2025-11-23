/*
  Warnings:

  - You are about to drop the column `orgId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `UserInformation` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `UserInformation` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `UserInformation` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `UserInformation` table. All the data in the column will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_orgId_fkey";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "orgId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'trainee';

-- AlterTable
ALTER TABLE "UserInformation" DROP COLUMN "country",
DROP COLUMN "language",
DROP COLUMN "postalCode",
DROP COLUMN "timezone",
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "height" INTEGER;

-- DropTable
DROP TABLE "Organization";
