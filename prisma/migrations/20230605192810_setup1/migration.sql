/*
  Warnings:

  - A unique constraint covering the columns `[nin]` on the table `BvnData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `nin` on table `BvnData` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BvnData" ALTER COLUMN "nin" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "cycle" DROP NOT NULL,
ALTER COLUMN "days_tenure" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BvnData_nin_key" ON "BvnData"("nin");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
