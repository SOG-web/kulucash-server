-- CreateTable
CREATE TABLE "Messages" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "chatListId" TEXT,
    "resolvedIssueId" TEXT,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "handlerId" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "online" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResolvedIssue" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "handlerId" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResolvedIssue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Messages_id_key" ON "Messages"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatList_id_key" ON "ChatList"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ResolvedIssue_id_key" ON "ResolvedIssue"("id");

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_chatListId_fkey" FOREIGN KEY ("chatListId") REFERENCES "ChatList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_resolvedIssueId_fkey" FOREIGN KEY ("resolvedIssueId") REFERENCES "ResolvedIssue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatList" ADD CONSTRAINT "ChatList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatList" ADD CONSTRAINT "ChatList_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResolvedIssue" ADD CONSTRAINT "ResolvedIssue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResolvedIssue" ADD CONSTRAINT "ResolvedIssue_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
