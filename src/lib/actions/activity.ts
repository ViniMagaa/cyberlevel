"use server";

import { db } from "@/lib/prisma";
import { calculateXP } from "../calculate-xp";

export type ProgressResponse = {
  started: boolean;
  completed: boolean;
  xpEarned: number | null;
  attempts: number;
  startedAt: Date | null;
  completedAt: Date | null;
};

export async function getProgress(
  userId: string,
  activityId: string,
): Promise<ProgressResponse> {
  const progress = await db.activityProgress.findFirst({
    where: { userId, activityId },
  });

  if (!progress) {
    return {
      started: false,
      completed: false,
      xpEarned: null,
      attempts: 0,
      startedAt: null,
      completedAt: null,
    };
  }

  return {
    started: !!progress.startedAt,
    completed: progress.status === "COMPLETED",
    xpEarned: progress.xpEarned,
    attempts: progress.attempts,
    startedAt: progress.startedAt,
    completedAt: progress.completedAt,
  };
}

export async function startActivity(userId: string, activityId: string) {
  const now = new Date();

  const progress = await db.activityProgress.upsert({
    where: { userId_activityId: { userId, activityId } },
    update: { startedAt: now, attempts: { increment: 1 } },
    create: {
      userId,
      activityId,
      status: "IN_PROGRESS",
      startedAt: now,
      attempts: 0,
    },
  });

  return progress;
}

export async function completeActivity(
  userId: string,
  activityId: string,
  startedAt: Date,
) {
  const now = new Date();
  const xpEarned = calculateXP(startedAt, now);

  await db.activityProgress.update({
    where: { userId_activityId: { userId, activityId } },
    data: {
      status: "COMPLETED",
      completedAt: now,
      xpEarned,
    },
  });

  await db.user.update({
    where: { id: userId },
    data: { xp: { increment: xpEarned } },
  });

  return { xpEarned };
}
