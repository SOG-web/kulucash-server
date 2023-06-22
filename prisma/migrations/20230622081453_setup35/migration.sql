-- AlterTable
ALTER TABLE "UserProperties" ADD COLUMN     "collector_due_date" TEXT DEFAULT '0',
ADD COLUMN     "customer_service_call_time" TEXT DEFAULT '0',
ADD COLUMN     "customer_service_due_date" TEXT DEFAULT '0',
ADD COLUMN     "telemarketer_due_date" TEXT DEFAULT '0',
ADD COLUMN     "verificator_due_date" TEXT DEFAULT '0',
ALTER COLUMN "verificator_call_time" SET DEFAULT '0',
ALTER COLUMN "collector_call_time" SET DEFAULT '0';
