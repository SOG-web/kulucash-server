/*
  Warnings:

  - Made the column `cycle` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `days_tenure` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "cycle" SET NOT NULL,
ALTER COLUMN "cycle" SET DEFAULT 0,
ALTER COLUMN "days_tenure" SET NOT NULL,
ALTER COLUMN "days_tenure" SET DEFAULT 0;
