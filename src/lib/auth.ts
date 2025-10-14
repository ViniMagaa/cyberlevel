"use server";

import { createClient } from "@/utils/supabase/server";
import { Prisma } from "@prisma/client";
import { User } from "@supabase/supabase-js";

type UserSessionData = User &
  Prisma.UserGetPayload<{ include: { currentArchetype: true; avatar: true } }>;

export async function getUserSession(): Promise<UserSessionData | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("User")
    .select("*, currentArchetype:Archetype(*), avatar:Avatar(*)")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    return null;
  }

  const userData: UserSessionData = {
    ...user,
    ...data,
  };

  return userData;
}
