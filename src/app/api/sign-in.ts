"use server";

import { createClient } from "@/utils/supabase/server";

type SignInProps = {
  email: string;
  password: string;
};

export default async function signIn({
  email,
  password,
}: SignInProps): Promise<
  | { success: true }
  | { success: false; error: { code: string; message: string } }
> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
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

  return { success: true };
}
