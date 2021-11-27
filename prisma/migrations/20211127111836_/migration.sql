/*
  Warnings:

  - The primary key for the `Author` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Destination` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Letter` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Letter" DROP CONSTRAINT "Letter_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Letter" DROP CONSTRAINT "Letter_destinationId_fkey";

-- AlterTable
ALTER TABLE "Author" DROP CONSTRAINT "Author_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Author_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Author_id_seq";

-- AlterTable
ALTER TABLE "Destination" DROP CONSTRAINT "Destination_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Destination_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Destination_id_seq";

-- AlterTable
ALTER TABLE "Letter" DROP CONSTRAINT "Letter_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "destinationId" SET DATA TYPE TEXT,
ALTER COLUMN "authorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Letter_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Letter_id_seq";

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letter" ADD CONSTRAINT "Letter_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
