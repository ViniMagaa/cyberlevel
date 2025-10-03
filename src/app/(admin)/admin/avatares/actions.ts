"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { formatPrismaError } from "@/lib/format-prisma-error";
import { supabaseAdmin } from "@/utils/supabase/supabase-admin";

const BUCKET = "avatars";

export async function createAvatar(avatar: Prisma.AvatarCreateInput) {
  try {
    await db.avatar.create({
      data: avatar,
    });
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao criar avatar:", message);
    throw new Error(`Erro ao criar avatar: ${message}`);
  }
}

export async function updateAvatar(
  id: string,
  avatar: Prisma.AvatarUpdateInput,
) {
  try {
    await db.avatar.update({
      where: { id },
      data: avatar,
    });
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao atualizar avatar:", message);
    throw new Error(`Erro ao atualizar avatar: ${message}`);
  }
}

export async function deleteAvatar(id: string) {
  try {
    await db.avatar.delete({
      where: { id },
    });
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao deletar avatar:", message);
    throw new Error(`Erro ao deletar avatar: ${message}`);
  }
}

export async function uploadAvatarImage(file: File) {
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
