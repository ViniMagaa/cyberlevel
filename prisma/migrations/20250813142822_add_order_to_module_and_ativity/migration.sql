/*
  Warnings:

  - Added the required column `order` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Activity" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Module" ADD COLUMN     "order" INTEGER NOT NULL;
