import { db } from "@/lib/prisma";

export async function calculateStreak(userId: string) {
  // pega os últimos progressos concluídos do usuário, ordenados do mais recente
  const progresses = await db.activityProgress.findMany({
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
  });

  if (progresses.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // ignora horas/minutos

  for (const progress of progresses) {
    const completedDate = new Date(progress.completedAt!);
    completedDate.setHours(0, 0, 0, 0);

    // diferença em dias
    const diffDays = Math.round(
      (currentDate.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0 || diffDays === 1) {
      // dia atual ou anterior → streak continua
      streak++;
      currentDate = completedDate;
    } else {
      // dia “quebrado” → streak acabou
      break;
    }
  }

  return streak;
}
