"use server";

import { db } from "@/lib/prisma";

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
