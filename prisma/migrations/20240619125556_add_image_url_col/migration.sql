/*
  Warnings:

  - You are about to drop the column `messageIds` on the `chat_rooms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chat_rooms" DROP COLUMN "messageIds";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "imageUrl" TEXT DEFAULT 'https://athena-img.s3.ap-southeast-1.amazonaws.com/default-avatar.png';
