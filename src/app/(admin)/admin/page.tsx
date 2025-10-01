import { SignOutButton } from "@/components/sign-out-button";
import { getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex w-full flex-wrap justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Olá, {user.name}!</h1>
          <p className="text-muted-foreground">
            Você está no painel administrativo.
          </p>
        </div>

        <SignOutButton />
      </div>
    </div>
  );
}
