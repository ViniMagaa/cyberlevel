"use server";

import { formatPrismaError } from "@/lib/format-prisma-error";
import { db } from "@/lib/prisma";
import { Prisma, ResponsibleLinkStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
      learner: { include: { avatar: true } },
    },
  });

  return learners;
}

export async function getResponsibleByLearnerId(learnerId: string) {
  const responsibleLinks = await db.responsibleLink.findMany({
    where: {
      learnerId,
    },
    include: {
      responsible: true,
    },
  });

  return responsibleLinks;
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

export async function updateResponsibleLinkById(
  id: string,
  data: Prisma.ResponsibleLinkUpdateInput,
) {
  try {
    await db.responsibleLink.update({
      where: { id },
      data,
    });
    revalidatePath("/");
  } catch (error) {
    const message = formatPrismaError(error);
    console.error("Erro ao atualizar link aprendiz - responsável:", message);
    throw new Error(
      `Erro ao atualizar link aprendiz - responsável: ${message}`,
    );
  }
}
