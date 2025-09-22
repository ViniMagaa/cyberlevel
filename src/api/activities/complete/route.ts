import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

const BASE_XP = 100; // XP base por atividade
const MIN_XP = 10; // XP mínimo

function calculateXP(startedAt: Date, completedAt: Date) {
  const timeTaken = (completedAt.getTime() - startedAt.getTime()) / 1000; // Segundos
  let xp = BASE_XP;
  if (timeTaken > 30) {
    xp -= Math.floor(timeTaken - 30); // Penalidade 1 XP por segundo extra
  }
  return Math.max(xp, MIN_XP);
}

export async function POST(req: NextRequest) {
  try {
    const { userId, activityId } = await req.json();

    // Busca o progresso atual
    let progress = await db.activityProgress.findUnique({
      where: {
        userId_activityId: { userId, activityId },
      },
    });

    const now = new Date();

    if (!progress) {
      return NextResponse.json(
        { error: "Progresso não encontrado" },
        { status: 404 },
      );
    }

    if (progress.status === "COMPLETED") {
      return NextResponse.json({
        message: "Atividade já concluída",
        xpEarned: progress.xpEarned,
      });
    }

    // Calcula XP
    const xpEarned = calculateXP(progress.startedAt!, now);

    // Atualiza progresso
    progress = await db.activityProgress.update({
      where: { userId_activityId: { userId, activityId } },
      data: {
        status: "COMPLETED",
        completedAt: now,
        xpEarned,
        attempts: progress.attempts + 1,
      },
    });

    // Atualiza XP do usuário
    const user = await db.user.update({
      where: { id: userId },
      data: { xp: { increment: xpEarned } },
    });

    return NextResponse.json({
      message: "Atividade concluída!",
      xpEarned,
      totalXP: user.xp,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
