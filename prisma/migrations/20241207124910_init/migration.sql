/*
  Warnings:

  - Added the required column `fileName` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileString` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `folderName` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "fileString" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "folderName" TEXT NOT NULL;
