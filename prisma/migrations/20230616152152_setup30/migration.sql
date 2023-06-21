-- CreateEnum
CREATE TYPE "LoanRepaymentType" AS ENUM ('FULL', 'PARTIAL');

-- CreateTable
CREATE TABLE "LoanRepayment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "loanId" TEXT NOT NULL,
    "type" "LoanRepaymentType" NOT NULL,
    "handler_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoanRepayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoanRepayment_id_key" ON "LoanRepayment"("id");

-- AddForeignKey
ALTER TABLE "LoanRepayment" ADD CONSTRAINT "LoanRepayment_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
