import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

const BASE_XP = 100;
const MIN_XP = 10;

function calculateXP(startedAt: Date, completedAt: Date) {
  const timeTaken = (completedAt.getTime() - startedAt.getTime()) / 1000;
  let xp = BASE_XP;
  if (timeTaken > 30) {
    xp -= Math.floor(timeTaken - 30);
  }
  return Math.max(xp, MIN_XP);
}

export async function POST(req: NextRequest) {
  try {
    const { userId, activityId } = await req.json();
    let progress = await db.activityProgress.findUnique({
      where: { userId_activityId: { userId, activityId } },
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
        message: "Já concluído",
        xpEarned: progress.xpEarned,
      });
    }

    const xpEarned = calculateXP(progress.startedAt!, now);

    progress = await db.activityProgress.update({
      where: { userId_activityId: { userId, activityId } },
      data: {
        status: "COMPLETED",
        completedAt: now,
        xpEarned,
        attempts: progress.attempts + 1,
      },
    });

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
    return NextResponse.json(
      { error: "Erro ao concluir atividade" },
      { status: 500 },
    );
  }
}
