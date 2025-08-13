"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { formatPrismaError } from "@/lib/format-prisma-error";

export async function createArchetype(archetype: Prisma.ArchetypeCreateInput) {
  try {
    await db.archetype.create({
      data: archetype,
    });
    revalidatePath("/arquetipos");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao criar arquétipo:", message);
    throw new Error(`Erro ao criar arquétipo: ${message}`);
  }
}

export async function updateArchetype(
  id: string,
  archetype: Prisma.ArchetypeUpdateInput,
) {
  try {
    await db.archetype.update({
      where: { id },
      data: archetype,
    });
    revalidatePath("/arquetipos");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao atualizar arquétipo:", message);
    throw new Error(`Erro ao atualizar arquétipo: ${message}`);
  }
}

export async function deleteArchetype(id: string) {
  try {
    await db.archetype.delete({
      where: { id },
    });
    revalidatePath("/arquetipos");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao deletar arquétipo:", message);
    throw new Error(`Erro ao deletar arquétipo: ${message}`);
  }
}
