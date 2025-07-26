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
  username,
  birthdate,
  role,
}: SignUpProps) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: name },
    },
  });

  if (error) {
    console.error("Erro ao cadastrar usuário:", error);
    throw new Error("Erro ao cadastrar usuário");
  }

  const user = data.user;

  if (!user) {
    throw new Error("Usuário não retornado após o cadastro");
  }

  // Criar usuário na tabela User
  await db.user.create({
    data: {
      id: user.id,
      name,
      username,
      email,
      birthdate,
      role,
    },
  });
}
