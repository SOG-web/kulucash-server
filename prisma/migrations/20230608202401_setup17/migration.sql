/*
  Warnings:

  - Added the required column `telemarketer_status` to the `UserProperties` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TeleMarketerUserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BACKSLIDDEN');

-- AlterTable
ALTER TABLE "UserProperties" ADD COLUMN     "telemarketer_status" "TeleMarketerUserStatus" NOT NULL;

-- DropEnum
DROP TYPE "UserStatus";
