/*
  Warnings:

  - You are about to drop the `Stat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Stat";

-- CreateTable
CREATE TABLE "Stats" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stats" JSONB NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);
