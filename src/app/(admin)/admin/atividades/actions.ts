"use server";

import { Activity, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { formatPrismaError } from "@/lib/format-prisma-error";

export async function createActivity(activity: Prisma.ActivityCreateInput) {
  try {
    await db.activity.create({
      data: activity,
    });
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao criar atividade:", message);
    throw new Error(`Erro ao criar atividade: ${message}`);
  }
}

export async function updateActivity(
  id: string,
  activity: Prisma.ActivityUpdateInput,
) {
  try {
    await db.activity.update({
      where: { id },
      data: activity,
    });
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao atualizar atividade:", message);
    throw new Error(`Erro ao atualizar atividade: ${message}`);
  }
}

export async function deleteActivity(id: string) {
  try {
    await db.activity.delete({
      where: { id },
    });
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao deletar atividade:", message);
    throw new Error(`Erro ao deletar atividade: ${message}`);
  }
}

export async function updateActivitiesOrder(activities: Activity[]) {
  const updates = activities.map((m) =>
    db.activity.update({
      where: { id: m.id },
      data: { order: m.order },
    }),
  );

  try {
    await db.$transaction(updates);
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao atualizar atividades:", message);
    throw new Error(`Erro ao atualizar atividade: ${message}`);
  }
}
