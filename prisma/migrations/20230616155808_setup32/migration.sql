/*
  Warnings:

  - You are about to drop the column `userId` on the `ChatList` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Disbursement` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Loans` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ResolvedIssue` table. All the data in the column will be lost.
  - Added the required column `userPropertiesId` to the `ChatList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userPropertiesId` to the `Disbursement` table without a default value. This is not possible if the table is not empty.
  - Made the column `userPropertiesId` on table `Loans` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userPropertiesId` to the `ResolvedIssue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChatList" DROP CONSTRAINT "ChatList_userId_fkey";

-- DropForeignKey
ALTER TABLE "Disbursement" DROP CONSTRAINT "Disbursement_userId_fkey";

-- DropForeignKey
ALTER TABLE "Loans" DROP CONSTRAINT "Loans_userId_fkey";

-- DropForeignKey
ALTER TABLE "Loans" DROP CONSTRAINT "Loans_userPropertiesId_fkey";

-- DropForeignKey
ALTER TABLE "ResolvedIssue" DROP CONSTRAINT "ResolvedIssue_userId_fkey";

-- AlterTable
ALTER TABLE "ChatList" DROP COLUMN "userId",
ADD COLUMN     "userPropertiesId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "userPropertiesId" TEXT;

-- AlterTable
ALTER TABLE "Disbursement" DROP COLUMN "userId",
ADD COLUMN     "userPropertiesId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Loans" DROP COLUMN "userId",
ALTER COLUMN "userPropertiesId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ResolvedIssue" DROP COLUMN "userId",
ADD COLUMN     "userPropertiesId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userPropertiesId_fkey" FOREIGN KEY ("userPropertiesId") REFERENCES "UserProperties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loans" ADD CONSTRAINT "Loans_userPropertiesId_fkey" FOREIGN KEY ("userPropertiesId") REFERENCES "UserProperties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disbursement" ADD CONSTRAINT "Disbursement_userPropertiesId_fkey" FOREIGN KEY ("userPropertiesId") REFERENCES "UserProperties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatList" ADD CONSTRAINT "ChatList_userPropertiesId_fkey" FOREIGN KEY ("userPropertiesId") REFERENCES "UserProperties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResolvedIssue" ADD CONSTRAINT "ResolvedIssue_userPropertiesId_fkey" FOREIGN KEY ("userPropertiesId") REFERENCES "UserProperties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
