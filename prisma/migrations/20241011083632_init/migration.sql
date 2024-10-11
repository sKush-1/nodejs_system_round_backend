/*
  Warnings:

  - A unique constraint covering the columns `[forgotToken]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Token_forgotToken_key" ON "Token"("forgotToken");
