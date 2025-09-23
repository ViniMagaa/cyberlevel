import { db } from "@/lib/prisma";

export async function calculateStreak(
  userId: string,
  timeZone: string = "America/Sao_Paulo",
) {
  // pega os últimos progressos concluídos do usuário
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

  // formata cada completedAt para o dia do usuário no fuso horário fornecido
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const daysSet = new Set<string>();

  for (const progress of progresses) {
    const dayStr = formatter.format(new Date(progress.completedAt!)); // YYYY-MM-DD
    daysSet.add(dayStr);
  }

  // transforma em array e ordena do mais recente para o mais antigo
  const sortedDays = Array.from(daysSet).sort((a, b) => (a < b ? 1 : -1));

  let streak = 0;
  // pega o dia atual no fuso do usuário
  const todayStr = formatter.format(new Date());
  let currentDateStr = todayStr;

  for (const dayStr of sortedDays) {
    // diferença em dias
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

  return streak;
}
