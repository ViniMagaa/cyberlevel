-- CreateEnum
CREATE TYPE "public"."ResponsibleLinkStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."ResponsibleLink" (
    "id" TEXT NOT NULL,
    "responsibleId" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "status" "public"."ResponsibleLinkStatus" NOT NULL DEFAULT 'ACCEPTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResponsibleLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ResponsibleLink" ADD CONSTRAINT "ResponsibleLink_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResponsibleLink" ADD CONSTRAINT "ResponsibleLink_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
