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
      ActivityProgress: {
        where: {
          status: "COMPLETED",
        },
        orderBy: {
          completedAt: "desc",
        },
      },
    },
  });

  return ranking;
}

export async function getRankingByArchetype() {
  const ranking = await db.archetype.findMany({
    include: {
      users: {
        orderBy: { xp: "desc" },
        include: {
          avatar: true,
          ActivityProgress: {
            where: {
              status: "COMPLETED",
            },
            orderBy: {
              completedAt: "desc",
            },
          },
        },
      },
    },
  });

  return ranking;
}
