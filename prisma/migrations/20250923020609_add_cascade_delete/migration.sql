-- DropForeignKey
ALTER TABLE "public"."Activity" DROP CONSTRAINT "Activity_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ActivityProgress" DROP CONSTRAINT "ActivityProgress_activityId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ArticleView" DROP CONSTRAINT "ArticleView_articleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Module" DROP CONSTRAINT "Module_archetypeId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Module" ADD CONSTRAINT "Module_archetypeId_fkey" FOREIGN KEY ("archetypeId") REFERENCES "public"."Archetype"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActivityProgress" ADD CONSTRAINT "ActivityProgress_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "public"."Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleView" ADD CONSTRAINT "ArticleView_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
