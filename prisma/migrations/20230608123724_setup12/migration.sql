/*
  Warnings:

  - You are about to drop the column `userId` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `email` to the `BvnData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enrollment_bank` to the `BvnData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enrollment_branch` to the `BvnData` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Loans` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'DISBURSED', 'PARTIALLY_PAID', 'PAID');

-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_userId_fkey";

-- DropIndex
DROP INDEX "Otp_userId_key";

-- AlterTable
ALTER TABLE "BvnData" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "enrollment_bank" TEXT NOT NULL,
ADD COLUMN     "enrollment_branch" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Loans" DROP COLUMN "status",
ADD COLUMN     "status" "LoanStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "Disbursement" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Disbursement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Disbursement_id_key" ON "Disbursement"("id");

-- AddForeignKey
ALTER TABLE "Disbursement" ADD CONSTRAINT "Disbursement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
