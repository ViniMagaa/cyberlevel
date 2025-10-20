"use server";

import { formatPrismaError } from "@/lib/format-prisma-error";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createResponsibleLink({
  responsibleId,
  learnerId,
}: {
  responsibleId: string;
  learnerId: string;
}) {
  try {
    const responsibleLink = await db.responsibleLink.findFirst({
      where: { responsibleId, learnerId },
    });

    if (!responsibleLink) {
      await db.responsibleLink.create({
        data: {
          responsibleId,
          learnerId,
        },
      });
      revalidatePath("/");
      return;
    }

    if (responsibleLink.status === "REJECTED") {
      await db.responsibleLink.update({
        where: { id: responsibleLink.id },
        data: {
          status: "PENDING",
          createdAt: new Date(),
        },
      });
      revalidatePath("/");
    }
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao criar link aprendiz - responsável:", message);
    throw new Error(`Erro ao criar link aprendiz - responsável: ${message}`);
  }
}
