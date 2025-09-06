"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  return await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      birthdate: true,
    },
  });
}

export async function deleteUser(id: string) {
  try {
    await db.user.delete({
      where: { id },
    });
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao deletar usuário" };
  }
}
