import { createClient } from "@/utils/supabase/server";
import { db } from "./prisma";

export async function requireUserSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, role: null };

  const data = await db.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  return {
    user,
    role: data?.role,
  };
}
