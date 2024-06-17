/*
  Warnings:

  - Added the required column `chatRoomId` to the `friendships` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'LOCATION');

-- AlterTable
ALTER TABLE "friendships" ADD COLUMN     "chatRoomId" TEXT NULL;

-- CreateTable
CREATE TABLE "chat_rooms" (
    "chatRoomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "friendshipId" TEXT NOT NULL,
    "messageIds" TEXT[],

    CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("chatRoomId")
);

-- CreateTable
CREATE TABLE "messages" (
    "messageId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" TEXT NOT NULL,
    "chatRoomId" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("messageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "chat_rooms_friendshipId_key" ON "chat_rooms"("friendshipId");

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_friendshipId_fkey" FOREIGN KEY ("friendshipId") REFERENCES "friendships"("friendshipId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "chat_rooms"("chatRoomId") ON DELETE RESTRICT ON UPDATE CASCADE;
