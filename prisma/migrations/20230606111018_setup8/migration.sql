/*
  Warnings:

  - You are about to drop the `Worker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Worker";

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "department" "Department" NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_id_key" ON "Staff"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_phone_number_key" ON "Staff"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");
