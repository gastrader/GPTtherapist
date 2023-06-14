/*
  Warnings:

  - You are about to drop the column `text_ai_response` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `text_prompt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `video_ai_response` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `video_prompt` on the `Message` table. All the data in the column will be lost.
  - Added the required column `aiResponseText` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prompt` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "aiResponseUrl" TEXT,
    "aiResponseText" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("conversationId", "createdAt", "id", "updatedAt", "userId") SELECT "conversationId", "createdAt", "id", "updatedAt", "userId" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
