-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "avatarId" TEXT;

-- CreateTable
CREATE TABLE "public"."Avatar" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "ageGroup" "public"."AgeGroup" NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "public"."Avatar"("id") ON DELETE SET NULL ON UPDATE CASCADE;
