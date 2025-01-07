/*
  Warnings:

  - Added the required column `fileSize` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUploadTime` to the `File` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Folder` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_userId_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "fileUploadTime" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
