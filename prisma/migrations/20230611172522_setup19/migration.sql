/*
  Warnings:

  - Changed the type of `loan_request_status` on the `Loans` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Loans" DROP COLUMN "loan_request_status",
ADD COLUMN     "loan_request_status" "LoanStatus" NOT NULL;

-- AlterTable
ALTER TABLE "UserProperties" ADD COLUMN     "verificator_call_time" TIMESTAMP(3);
