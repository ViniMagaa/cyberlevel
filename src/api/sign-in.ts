"use server";

import { createClient } from "@/utils/supabase/server";

type SignInProps = {
  email: string;
  password: string;
};

export default async function signIn({ email, password }: SignInProps) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Erro ao entrar:", error);
    throw new Error("Erro ao entrar", error);
  }
}
