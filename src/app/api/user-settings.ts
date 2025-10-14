"use server";

import { handleAuthError } from "@/lib/handle-auth-error";
import { db } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/supabase-admin";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateUserData(
  userId: string,
  data: Prisma.UserUpdateInput,
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "Usuário não encontrado" };

    await db.user.update({
      where: { id: userId },
      data: { ...data },
    });

    if (
      user.email === data.email &&
      user.user_metadata.display_name === data.name
    )
      return { success: true };

    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        email: String(data.email),
        user_metadata: {
          display_name: data.name,
        },
      });

    if (updateError) {
      const message = updateError.code
        ? handleAuthError(updateError.code)
        : "Erro ao atualizar dados";

      return {
        success: false,
        message,
      };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log(error);
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
    const message = signInError.code
      ? handleAuthError(signInError.code)
      : "Erro ao verificar a senha atual";
    return {
      success: false,
      message,
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    const message = updateError.code
      ? handleAuthError(updateError.code)
      : "Erro ao atualizar a senha";

    return {
      success: false,
      message,
    };
  }

  return {
    success: true,
    message: "Senha alterada com sucesso!",
  };
}

export async function deleteUser(id: string) {
  try {
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

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
