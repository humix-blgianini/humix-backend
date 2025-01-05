-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "dateRated" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "_UserAlbuns" ADD CONSTRAINT "_UserAlbuns_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_UserAlbuns_AB_unique";
