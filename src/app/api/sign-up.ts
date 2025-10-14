"use server";

import { handleAuthError } from "@/lib/handle-auth-error";
import { db } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { Prisma } from "@prisma/client";

type SignUpProps = Prisma.UserCreateInput & {
  password: string;
};

export default async function signUp({
  email,
  password,
  name,
  ...rest
}: SignUpProps): Promise<
  { success: true } | { success: false; error: string }
> {
  const username = await db.user.findUnique({
    where: { username: rest.username },
  });

  if (username) {
    return {
      success: false,
      error: "O nome de usuário já está sendo utilizado",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: name },
    },
  });

  if (error) {
    return {
      success: false,
      error: handleAuthError(error.code ?? "unexpected_error"),
    };
  }

  const user = data.user;

  if (!user) {
    return {
      success: false,
      error: "Usuário não encontrado após o cadastro",
    };
  }

  // Criar usuário na tabela User
  await db.user.create({
    data: {
      id: user.id,
      name,
      email,
      ...rest,
    },
  });

  return { success: true };
}
