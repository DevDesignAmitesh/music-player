-- AlterTable
ALTER TABLE "Streams" ALTER COLUMN "url" DROP NOT NULL,
ALTER COLUMN "url" SET DEFAULT '',
ALTER COLUMN "extractedId" DROP NOT NULL,
ALTER COLUMN "extractedId" SET DEFAULT '',
ALTER COLUMN "bigImg" DROP NOT NULL,
ALTER COLUMN "bigImg" SET DEFAULT '',
ALTER COLUMN "smallImg" DROP NOT NULL,
ALTER COLUMN "smallImg" SET DEFAULT '',
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "title" SET DEFAULT '';
