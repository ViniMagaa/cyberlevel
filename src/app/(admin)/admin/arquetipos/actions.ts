"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { formatPrismaError } from "@/lib/format-prisma-error";
import { supabaseAdmin } from "@/utils/supabase/supabase-admin";

const BUCKET = "archetypes";

export async function createArchetype(archetype: Prisma.ArchetypeCreateInput) {
  try {
    await db.archetype.create({
      data: archetype,
    });
    revalidatePath("/");
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
    revalidatePath("/");
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
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao deletar arquétipo:", message);
    throw new Error(`Erro ao deletar arquétipo: ${message}`);
  }
}

export async function uploadArchetypeImage(file: File) {
  if (!file) throw new Error("Arquivo não enviado");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.type.split("/")[1] || "png";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const filepath = `${filename}`;

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
