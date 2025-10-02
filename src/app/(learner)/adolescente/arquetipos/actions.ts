"use server";

import { formatPrismaError } from "@/lib/format-prisma-error";
import { db } from "@/lib/prisma";

export async function selectArchetype(id: string, userId: string) {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        currentArchetypeId: id,
      },
    });
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao selecionar arquétipo:", message);
    throw new Error(`Erro ao selecionar arquétipo: ${message}`);
  }
}
