-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BACKSLIDDEN');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('NOTCALLED', 'CALLED', 'INPROGRESS');

-- CreateTable
CREATE TABLE "UserProperties" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "telemarketer_call_status" "CallStatus" NOT NULL,
    "telemarketer_handler_id" TEXT NOT NULL,
    "telemarketer_call_count" INTEGER NOT NULL,
    "telemarketer_call_time" TIMESTAMP(3),
    "customer_service_call_status" "CallStatus" NOT NULL,
    "collector_call_status" "CallStatus" NOT NULL,
    "verificator_call_status" "CallStatus" NOT NULL,
    "customer_service_call_count" INTEGER NOT NULL,
    "collector_call_count" INTEGER NOT NULL,
    "verificator_call_count" INTEGER NOT NULL,
    "customer_service_handler_id" TEXT NOT NULL,
    "collector_handler_id" TEXT NOT NULL,
    "verificator_handler_id" TEXT NOT NULL,

    CONSTRAINT "UserProperties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "department" "Department" NOT NULL,
    "staffId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProperties_id_key" ON "UserProperties"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserProperties_userId_key" ON "UserProperties"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_key" ON "Comment"("id");

-- AddForeignKey
ALTER TABLE "UserProperties" ADD CONSTRAINT "UserProperties_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
