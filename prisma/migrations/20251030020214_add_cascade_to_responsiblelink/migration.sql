-- DropForeignKey
ALTER TABLE "public"."ResponsibleLink" DROP CONSTRAINT "ResponsibleLink_learnerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ResponsibleLink" DROP CONSTRAINT "ResponsibleLink_responsibleId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ResponsibleLink" ADD CONSTRAINT "ResponsibleLink_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResponsibleLink" ADD CONSTRAINT "ResponsibleLink_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
