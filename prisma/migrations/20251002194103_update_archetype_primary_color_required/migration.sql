/*
  Warnings:

  - Made the column `primaryColor` on table `Archetype` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Archetype" ALTER COLUMN "primaryColor" SET NOT NULL;
