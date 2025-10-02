-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "ageGroup" "public"."AgeGroup",
ADD COLUMN     "currentArchetypeId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_currentArchetypeId_fkey" FOREIGN KEY ("currentArchetypeId") REFERENCES "public"."Archetype"("id") ON DELETE SET NULL ON UPDATE CASCADE;
