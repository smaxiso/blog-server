/*
  Warnings:

  - You are about to drop the column `date` on the `Blog` table. All the data in the column will be lost.
  - Added the required column `type` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "date",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "timestamp" TIMESTAMP(3),
ADD COLUMN     "type" TEXT NOT NULL;
