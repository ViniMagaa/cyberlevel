"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { formatPrismaError } from "@/lib/format-prisma-error";
import { supabaseAdmin } from "@/utils/supabase/supabase-admin";

export async function createProduct(product: Prisma.ProductCreateInput) {
  try {
    await db.product.create({
      data: product,
    });
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao criar produto:", message);
    throw new Error(`Erro ao criar produto: ${message}`);
  }
}

export async function updateProduct(
  id: string,
  product: Prisma.ProductUpdateInput,
) {
  try {
    await db.product.update({
      where: { id },
      data: product,
    });
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao atualizar produto:", message);
    throw new Error(`Erro ao atualizar produto: ${message}`);
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.product.delete({
      where: { id },
    });
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao deletar produto:", message);
    throw new Error(`Erro ao deletar produto: ${message}`);
  }
}

export async function uploadProductImage(file: File, folder: string) {
  if (!file) throw new Error("Arquivo não enviado");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.type.split("/")[1] || "png";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const filepath = `${folder}/${filename}`;

  const { error } = await supabaseAdmin.storage
    .from("activities")
    .upload(filepath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabaseAdmin.storage
    .from("activities")
    .getPublicUrl(filepath);

  return data.publicUrl;
}
