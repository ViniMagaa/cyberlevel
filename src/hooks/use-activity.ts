"use client";

import {
  completeActivity,
  getProgress,
  ProgressResponse,
  startActivity,
} from "@/lib/actions/activity";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export function useActivity(userId: string, activityId: string) {
  const [isPending, startTransition] = useTransition();
  const [progress, setProgress] = useState<ProgressResponse>({
    started: false,
    completed: false,
    xpEarned: null,
    attempts: 0,
    startedAt: null,
    completedAt: null,
  });

  // Busca progresso inicial
  useEffect(() => {
    async function fetchProgress() {
      const data = await getProgress(userId, activityId);
      setProgress(data);
    }
    fetchProgress();
  }, [userId, activityId]);

  function start() {
    startTransition(async () => {
      const { attempts, startedAt } = await startActivity(userId, activityId);
      setProgress((prev) => ({ ...prev, attempts, startedAt, started: true }));
    });
  }

  function complete() {
    startTransition(async () => {
      if (progress.startedAt === null) {
        toast.error("Atividade não iniciada");
        return;
      }

      const { xpEarned } = await completeActivity(
        userId,
        activityId,
        progress.startedAt,
      );
      setProgress((prev) => ({
        ...prev,
        completed: true,
        xpEarned,
        completedAt: new Date(),
        attempts: prev.attempts + 1,
      }));
    });
  }

  return {
    isPending,
    ...progress,
    start,
    complete,
  };
}
