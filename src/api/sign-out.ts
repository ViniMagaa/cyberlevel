"use server";

import { createClient } from "@/utils/supabase/server";

export default async function signOut(): Promise<
  | { success: true }
  | { success: false; error: { code: string; message: string } }
> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

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
