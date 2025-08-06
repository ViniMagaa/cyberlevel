import { createClient } from "@/utils/supabase/server";
import { db } from "./prisma";

export async function requireUserSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const data = await db.user.findUnique({ where: { id: user.id } });
  if (!data) return null;

  return data;
}
