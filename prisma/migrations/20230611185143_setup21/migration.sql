/*
  Warnings:

  - The `status` column on the `Staff` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StaffStatus" AS ENUM ('ONLINE', 'AWAY', 'OFFLINE');

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "status",
ADD COLUMN     "status" "StaffStatus" NOT NULL DEFAULT 'OFFLINE';
