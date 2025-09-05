import { SignOutButton } from "@/components/sign-out-button";
import { db } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/dashboard");

  const userData = await db.user.findUnique({ where: { id: user.id } });

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex w-full flex-wrap justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Olá, {userData?.name}!</h1>
          <p className="text-muted-foreground">
            Você está no painel administrativo.
          </p>
        </div>

        <SignOutButton />
      </div>
    </div>
  );
}
