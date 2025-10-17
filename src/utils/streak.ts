import { db } from "@/lib/prisma";
import { ActivityProgress } from "@prisma/client";

export async function calculateStreak({
  userId,
  timeZone = "America/Sao_Paulo",
  activityProgresses,
}: {
  userId?: string;
  timeZone?: string;
  activityProgresses?: ActivityProgress[];
}) {
  const progresses =
    activityProgresses ??
    (await db.activityProgress.findMany({
      where: {
        userId,
        status: "COMPLETED",
      },
      orderBy: {
        completedAt: "desc",
      },
      select: {
        completedAt: true,
      },
    }));

  if (!progresses || progresses.length === 0) {
    return { streak: 0, isToday: false };
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const daysSet = new Set<string>();
  for (const progress of progresses) {
    if (progress.completedAt) {
      daysSet.add(formatter.format(new Date(progress.completedAt)));
    }
  }

  const sortedDays = Array.from(daysSet).sort((a, b) => (a < b ? 1 : -1));

  let streak = 0;
  const todayStr = formatter.format(new Date());
  let currentDateStr = todayStr;

  for (const dayStr of sortedDays) {
    const currentDate = new Date(currentDateStr);
    const completedDate = new Date(dayStr);
    const diffDays = Math.round(
      (currentDate.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0 || diffDays === 1) {
      streak++;
      currentDateStr = dayStr;
    } else {
      break;
    }
  }

  // verifica se o último progresso foi hoje
  const latestProgress = progresses[0];
  const latestStr = formatter.format(new Date(latestProgress.completedAt!));
  const isToday = latestStr === todayStr;

  return { streak, isToday };
}
