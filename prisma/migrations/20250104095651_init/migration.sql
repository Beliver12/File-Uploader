/*
  Warnings:

  - The `fileUploadTime` column on the `File` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "fileUploadTime",
ADD COLUMN     "fileUploadTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
