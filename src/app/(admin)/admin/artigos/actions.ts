"use server";

import { formatPrismaError } from "@/lib/format-prisma-error";
import { db } from "@/lib/prisma";
import { supabaseAdmin } from "@/utils/supabase/supabase-admin";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const BUCKET = "articles";

export async function createArticle(article: Prisma.ArticleCreateInput) {
  try {
    await db.article.create({
      data: article,
    });
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao criar artigo:", message);
    throw new Error(`Erro ao criar artigo: ${message}`);
  }
}

export async function updateArticle(
  id: string,
  article: Prisma.ArticleUpdateInput,
) {
  try {
    await db.article.update({
      where: { id },
      data: article,
    });
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao atualizar artigo:", message);
    throw new Error(`Erro ao atualizar artigo: ${message}`);
  }
}

export async function deleteArticle(id: string) {
  try {
    await db.article.delete({
      where: { id },
    });
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao deletar artigo:", message);
    throw new Error(`Erro ao deletar artigo: ${message}`);
  }
}

export async function uploadArticleImage(file: File, folder: string) {
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
