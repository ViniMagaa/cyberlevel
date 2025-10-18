"use server";

import { formatPrismaError } from "@/lib/format-prisma-error";
import { db } from "@/lib/prisma";
import { ResponsibleLinkStatus } from "@prisma/client";
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

export async function getLearnersByResponsibleId(
  responsibleId: string,
  status?: ResponsibleLinkStatus,
) {
  const learners = await db.responsibleLink.findMany({
    where: {
      responsibleId,
      status,
    },
    include: {
      learner: true,
    },
  });

  return learners;
}

export async function deleteResponsibleLinkById(id: string) {
  try {
    await db.responsibleLink.delete({
      where: { id },
    });
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao deletar link aprendiz - responsável:", message);
    throw new Error(`Erro ao deletar link aprendiz - responsável: ${message}`);
  }
}
