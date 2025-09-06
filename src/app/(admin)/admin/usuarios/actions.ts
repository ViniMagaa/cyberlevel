"use server";

import { db } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
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
  const supabase = await createClient();

  try {
    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    if (authError) {
      console.error("Erro Supabase Auth:", authError.message);
      return {
        success: false,
        error: authError.message ?? "Erro ao remover usuário no Supabase",
      };
    }

    await db.user.delete({ where: { id } });

    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "Erro ao deletar usuário",
    };
  }
}
