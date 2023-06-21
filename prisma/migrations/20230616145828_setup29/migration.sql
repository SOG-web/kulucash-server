-- AlterTable
ALTER TABLE "BvnData" ALTER COLUMN "date_of_birth" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "EmploymentDetails" ALTER COLUMN "date_of_employment" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "dob" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "UserProperties" ALTER COLUMN "telemarketer_call_time" SET DATA TYPE TEXT,
ALTER COLUMN "verificator_call_time" SET DATA TYPE TEXT;
