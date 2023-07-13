-- CreateEnum
CREATE TYPE "InterestStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "BvnData" ADD COLUMN     "reference" TEXT;

-- AlterTable
ALTER TABLE "Interest" ADD COLUMN     "status" "InterestStatus" NOT NULL DEFAULT 'ACTIVE';
