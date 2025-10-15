import { db } from "@/lib/prisma";
import { AgeGroup } from "@prisma/client";

export async function getRanking(ageGroup?: AgeGroup) {
  const ranking = await db.user.findMany({
    where: {
      ageGroup,
    },
    orderBy: {
      xp: "desc",
    },
    select: {
      id: true,
      name: true,
      username: true,
      xp: true,
      avatar: true,
      currentArchetype: true,
    },
  });

  return ranking;
}
