"use server";

import { formatPrismaError } from "@/lib/format-prisma-error";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPublishedArticleById(id: string, userId: string) {
  const articles = await db.article.findUnique({
    where: { id, isPublished: true },
    include: {
      author: { select: { name: true } },
      views: { where: { userId }, take: 1 },
    },
  });

  return articles;
}

export async function getPublishedArticles(userId: string, take?: number) {
  const articles = await db.article.findMany({
    orderBy: { createdAt: "desc" },
    where: { isPublished: true },
    include: {
      author: { select: { name: true } },
      views: { where: { userId }, take: 1 },
    },
    take,
  });

  return articles;
}

export async function createArticleView(articleId: string, userId: string) {
  try {
    await db.articleView.upsert({
      where: {
        articleId_userId: { articleId, userId },
      },
      update: {
        viewedAt: new Date(),
      },
      create: {
        articleId,
        userId,
      },
    });

    revalidatePath(`/responsavel/artigos/${articleId}`);
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao registrar visualização:", message);
    throw new Error(`Erro ao registrar visualização: ${message}`);
  }
}
