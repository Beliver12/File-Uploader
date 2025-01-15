/*
  Warnings:

  - You are about to drop the column `fileString` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "fileString",
DROP COLUMN "publicId";
