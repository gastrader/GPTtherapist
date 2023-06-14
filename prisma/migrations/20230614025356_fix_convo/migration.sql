/*
  Warnings:

  - Made the column `conversationId` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "video_prompt" TEXT,
    "video_ai_response" TEXT,
    "text_prompt" TEXT,
    "text_ai_response" TEXT,
    "userId" TEXT,
    "conversationId" TEXT NOT NULL,
    CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("conversationId", "createdAt", "id", "text_ai_response", "text_prompt", "updatedAt", "userId", "video_ai_response", "video_prompt") SELECT "conversationId", "createdAt", "id", "text_ai_response", "text_prompt", "updatedAt", "userId", "video_ai_response", "video_prompt" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
