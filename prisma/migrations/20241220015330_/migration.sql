/*
  Warnings:

  - You are about to drop the column `userId` on the `Album` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[link]` on the table `Album` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_userId_fkey";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_UserAlbuns" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserAlbuns_AB_unique" ON "_UserAlbuns"("A", "B");

-- CreateIndex
CREATE INDEX "_UserAlbuns_B_index" ON "_UserAlbuns"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Album_link_key" ON "Album"("link");

-- AddForeignKey
ALTER TABLE "_UserAlbuns" ADD CONSTRAINT "_UserAlbuns_A_fkey" FOREIGN KEY ("A") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserAlbuns" ADD CONSTRAINT "_UserAlbuns_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
