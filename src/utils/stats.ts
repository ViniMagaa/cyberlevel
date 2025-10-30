import { db } from "@/lib/prisma";
import { startOfDay, subDays } from "date-fns";

export async function getLearnerStats(learnerId: string) {
  const learner = await db.user.findUnique({
    where: { id: learnerId },
    include: {
      currentArchetype: true,
    },
  });

  if (!learner) throw new Error("Aprendiz não encontrado");

  const [lastActivitiesProgress, ranking] = await Promise.all([
    db.activityProgress.findMany({
      where: { userId: learnerId, status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
      include: {
        activity: {
          select: {
            title: true,
            type: true,
            content: true,
            module: { include: { archetype: true } },
          },
        },
      },
    }),
    await db.user.findMany({
      where: {
        ageGroup: learner.ageGroup,
      },
      orderBy: {
        xp: "desc",
      },
    }),
  ]);

  const lastProgress = lastActivitiesProgress[0];

  const currentModuleActivities = lastProgress?.activity.module.id
    ? await db.activity.findMany({
        where: {
          moduleId: lastProgress?.activity.module.id,
        },
        include: {
          activityProgress: {
            where: {
              userId: learnerId,
            },
            select: {
              status: true,
            },
          },
        },
      })
    : [];

  const totalTime = await calculateTotalTime(learnerId);

  const position = ranking.findIndex((u) => u.id === learnerId) + 1;

  const today = startOfDay(new Date());
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
  const weeklyData = last7Days.map((day) => {
    const dayLabel = day
      .toLocaleDateString("pt-BR", { weekday: "short" })
      .replace(".", "")
      .slice(0, 3);

    const count = lastActivitiesProgress.filter((p) => {
      if (!p.completedAt) return false;
      const completed = new Date(p.completedAt);
      return (
        completed.getDate() === day.getDate() &&
        completed.getMonth() === day.getMonth() &&
        completed.getFullYear() === day.getFullYear()
      );
    }).length;

    return {
      day: dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1),
      activities: count,
    };
  });

  return {
    currentLevel: {
      module: lastProgress?.activity.module.title,
      archetype: lastProgress?.activity.module.archetype?.name,
    },
    lastActivity: {
      title: lastProgress?.activity.title,
      type: lastProgress?.activity.type,
    },
    moduleProgress: {
      completed: currentModuleActivities.filter(
        (activity) =>
          activity.activityProgress.filter(
            (progress) => progress.status === "COMPLETED",
          ).length > 0,
      ).length,
      total: currentModuleActivities.length,
    },
    totalTime,
    ranking: {
      position,
      total: ranking.length,
    },
    lastActivitiesProgress,
    weeklyData,
  };
}

/**
 * Calcula o tempo total gasto em atividades (retorna horas e minutos formatados)
 */
export async function calculateTotalTime(userId: string) {
  const progresses = await db.activityProgress.findMany({
    where: {
      userId,
      status: "COMPLETED",
      startedAt: { not: null },
      completedAt: { not: null },
    },
    select: {
      startedAt: true,
      completedAt: true,
    },
  });

  if (progresses.length === 0) {
    return { hours: 0, minutes: 0, formatted: "0min" };
  }

  let totalMs = 0;

  for (const p of progresses) {
    const start = new Date(p.startedAt!);
    const end = new Date(p.completedAt!);
    if (end > start) totalMs += end.getTime() - start.getTime();
  }

  const totalMinutes = Math.floor(totalMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const formatted = (hours > 0 ? `${hours}h` : "") + `${minutes}min`;

  return { hours, minutes, formatted };
}
