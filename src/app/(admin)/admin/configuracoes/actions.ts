"use server";

import { db } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getUser(id: string) {
  return await db.user.findUnique({
    where: { id },
  });
}

export async function updateUserData(
  userId: string,
  data: Prisma.UserUpdateInput,
) {
  try {
    await db.user.update({
      where: { id: userId },
      data: { ...data },
    });

    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao atualizar dados" };
  }
}

export async function updatePassword(
  email: string,
  currentPassword: string,
  newPassword: string,
): Promise<{
  success: boolean;
  message: string;
}> {
  const supabase = await createClient();

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (signInError) {
    return {
      success: false,
      message: "Senha atual incorreta.",
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return {
      success: false,
      message: updateError.message,
    };
  }

  return {
    success: true,
    message: "Senha alterada com sucesso!",
  };
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
