"use server";

import { db } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
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

export async function updateUserRole(userId: string, role: UserRole) {
  try {
    await db.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao atualizar função" };
  }
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
