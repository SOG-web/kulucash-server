/*
  Warnings:

  - Added the required column `bank_code` to the `BankDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankId` to the `Loans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardId` to the `Loans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankDetail" ADD COLUMN     "bank_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Loans" ADD COLUMN     "bankId" TEXT NOT NULL,
ADD COLUMN     "cardId" TEXT NOT NULL,
ALTER COLUMN "amount_disbursed" DROP NOT NULL,
ALTER COLUMN "amount_owed" DROP NOT NULL,
ALTER COLUMN "amount_paid" DROP NOT NULL,
ALTER COLUMN "loan_date" DROP NOT NULL,
ALTER COLUMN "loan_due_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "id_card" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "UserProperties" ALTER COLUMN "telemarketer_handler_id" DROP NOT NULL,
ALTER COLUMN "telemarketer_call_count" DROP NOT NULL,
ALTER COLUMN "customer_service_call_count" DROP NOT NULL,
ALTER COLUMN "collector_call_count" DROP NOT NULL,
ALTER COLUMN "verificator_call_count" DROP NOT NULL,
ALTER COLUMN "customer_service_handler_id" DROP NOT NULL,
ALTER COLUMN "collector_handler_id" DROP NOT NULL,
ALTER COLUMN "verificator_handler_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Loans" ADD CONSTRAINT "Loans_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "BankDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loans" ADD CONSTRAINT "Loans_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "CardDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
