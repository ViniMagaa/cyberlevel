import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, activityId } = await req.json();

    // Busca progresso existente
    let progress = await db.activityProgress.findUnique({
      where: {
        userId_activityId: { userId, activityId },
      },
    });

    const now = new Date();

    if (!progress) {
      // Cria novo progresso
      progress = await db.activityProgress.create({
        data: {
          userId,
          activityId,
          status: "IN_PROGRESS",
          startedAt: now,
          attempts: 1,
          xpEarned: 0,
        },
      });
    } else {
      // Atualiza existente
      progress = await db.activityProgress.update({
        where: {
          userId_activityId: { userId, activityId },
        },
        data: {
          status: "IN_PROGRESS",
          startedAt: now,
          attempts: progress.attempts + 1,
        },
      });
    }

    return NextResponse.json({ message: "Atividade iniciada!", progress });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
