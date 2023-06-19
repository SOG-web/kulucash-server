/*
  Warnings:

  - Added the required column `overDueDays` to the `Loans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overDueFee` to the `Loans` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OverDueCategory" AS ENUM ('D1', 'D2', 'D0', 'S1', 'S2', 'M1', 'M2', 'M3');

-- CreateEnum
CREATE TYPE "DisbursementStatus" AS ENUM ('PAID', 'FAILED', 'PENDING', 'NOTDISBURSED');

-- DropIndex
DROP INDEX "BankDetail_userId_key";

-- AlterTable
ALTER TABLE "Loans" ADD COLUMN     "disbursementStatus" "DisbursementStatus" NOT NULL DEFAULT 'NOTDISBURSED',
ADD COLUMN     "overDueCategory" "OverDueCategory",
ADD COLUMN     "overDueDays" INTEGER NOT NULL,
ADD COLUMN     "overDueFee" DOUBLE PRECISION NOT NULL;
