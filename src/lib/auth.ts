"use server";

import { createClient } from "@/utils/supabase/server";
import { User as UserData } from "@prisma/client";
import { User } from "@supabase/supabase-js";

export async function getUserSession(): Promise<(User & UserData) | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    return null;
  }

  const userData: User & UserData = {
    ...user,
    ...data,
  };

  return userData;
}
