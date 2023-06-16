-- AlterTable
ALTER TABLE "Loans" ADD COLUMN     "userPropertiesId" TEXT;

-- AlterTable
ALTER TABLE "UserProperties" ADD COLUMN     "collector_call_time" TEXT;

-- AddForeignKey
ALTER TABLE "Loans" ADD CONSTRAINT "Loans_userPropertiesId_fkey" FOREIGN KEY ("userPropertiesId") REFERENCES "UserProperties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
