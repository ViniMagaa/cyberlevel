"use server";

import { Module, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { formatPrismaError } from "@/lib/format-prisma-error";
import { supabaseAdmin } from "@/utils/supabase/supabase-admin";

const BUCKET = "modules";

export async function createModule(module: Prisma.ModuleCreateInput) {
  try {
    const lastOrder = await db.module.aggregate({
      _max: { order: true },
      where: {
        ageGroup: module.ageGroup,
        archetypeId: module.archetype?.connect?.id ?? undefined,
      },
    });

    const newModuleData: Prisma.ModuleCreateInput = {
      ...module,
      order: (lastOrder._max.order ?? -1) + 1,
    };

    await db.module.create({
      data: newModuleData,
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

export async function uploadModuleImage(file: File, folder: string) {
  if (!file) throw new Error("Arquivo não enviado");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.type.split("/")[1] || "png";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const filepath = `${folder}/${filename}`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filepath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filepath);

  return data.publicUrl;
}
