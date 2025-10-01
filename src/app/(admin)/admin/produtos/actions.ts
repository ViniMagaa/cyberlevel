"use server";

import { formatPrismaError } from "@/lib/format-prisma-error";
import { db } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/prisma-helpers";
import { supabaseAdmin } from "@/utils/supabase/supabase-admin";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const BUCKET = "products";

export async function getProductById(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
    });

    return decimalToNumber(product);
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao buscar produto:", message);
    throw new Error(`Erro ao buscar produto: ${message}`);
  }
}

export async function getProducts() {
  try {
    const products = await db.product.findMany({
      orderBy: { name: "asc" },
    });

    return decimalToNumber(products);
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao buscar produtos:", message);
    throw new Error(`Erro ao buscar produtos: ${message}`);
  }
}

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

export async function uploadProductImage(file: File) {
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
