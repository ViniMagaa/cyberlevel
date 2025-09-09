"use server";

import { db } from "@/lib/prisma";

export async function getActiveProducts() {
  const products = await db.product.findMany({
    orderBy: { name: "asc" },
    where: { active: true },
  });

  return products;
}
