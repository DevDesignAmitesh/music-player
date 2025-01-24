/*
  Warnings:

  - Added the required column `bigImg` to the `Streams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smallImg` to the `Streams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Streams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Streams" ADD COLUMN     "bigImg" TEXT NOT NULL,
ADD COLUMN     "smallImg" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
