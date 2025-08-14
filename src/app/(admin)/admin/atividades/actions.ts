"use server";

import { Module, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { formatPrismaError } from "@/lib/format-prisma-error";

export async function createModule(module: Prisma.ModuleCreateInput) {
  try {
    await db.module.create({
      data: module,
    });
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao criar módulo:", message);
    throw new Error(`Erro ao criar módulo: ${message}`);
  }
}

export async function updateModule(
  id: string,
  module: Prisma.ModuleUpdateInput,
) {
  try {
    await db.module.update({
      where: { id },
      data: module,
    });
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao atualizar módulo:", message);
    throw new Error(`Erro ao atualizar módulo: ${message}`);
  }
}

export async function deleteModule(id: string) {
  try {
    await db.module.delete({
      where: { id },
    });
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao deletar módulo:", message);
    throw new Error(`Erro ao deletar módulo: ${message}`);
  }
}

export async function updateModulesOrder(modules: Module[]) {
  const updates = modules.map((m) =>
    db.module.update({
      where: { id: m.id },
      data: { order: m.order },
    }),
  );

  try {
    await db.$transaction(updates);
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao atualizar módulos:", message);
    throw new Error(`Erro ao atualizar módulo: ${message}`);
  }
}
