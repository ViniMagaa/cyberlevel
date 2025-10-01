"use server";

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
  | { success: true }
  | { success: false; error: { code: string; message: string } }
> {
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
      error: {
        code: error.code ?? "unexpected_error",
        message: error.message,
      },
    };
  }

  const user = data.user;

  if (!user) {
    return {
      success: false,
      error: {
        code: "user_not_found",
        message: "User not found after sign up",
      },
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
