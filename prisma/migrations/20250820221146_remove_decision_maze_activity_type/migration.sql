/*
  Warnings:

  - The values [DECISION_MAZE] on the enum `ActivityType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ActivityType_new" AS ENUM ('FAKE_NEWS', 'POST_OR_NOT', 'QUIZ', 'THEMED_PASSWORD', 'FAKE_CHAT', 'MATCH_PAIRS', 'INFORMATIVE_TEXT');
ALTER TABLE "public"."Activity" ALTER COLUMN "type" TYPE "public"."ActivityType_new" USING ("type"::text::"public"."ActivityType_new");
ALTER TYPE "public"."ActivityType" RENAME TO "ActivityType_old";
ALTER TYPE "public"."ActivityType_new" RENAME TO "ActivityType";
DROP TYPE "public"."ActivityType_old";
COMMIT;
