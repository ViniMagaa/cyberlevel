import { SettingsActions } from "@/components/settings-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUserSession } from "@/lib/auth";
import { formatDate } from "@/utils/format-date";
import { redirect } from "next/navigation";

export default async function Settings() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  return (
    <div className="w-full space-y-4 p-4">
      <h1 className="text-center text-4xl font-bold">Configurações</h1>

      <div className="mx-auto max-w-2xl space-y-4">
        <Card className="p-4">
          <CardContent className="space-y-4 p-0">
            <div className="text-md flex justify-between sm:text-xl">
              <strong>Nome</strong> <span>{user.name}</span>
            </div>
            <Separator />
            <div className="text-md flex justify-between sm:text-xl">
              <strong>Nome de usuário</strong> <span>{user.username}</span>
            </div>
            <Separator />
            <div className="text-md flex justify-between sm:text-xl">
              <strong>E-mail</strong> <span>{user.email}</span>
            </div>
            <Separator />
            <div className="text-md flex justify-between sm:text-xl">
              <strong>Nascimento</strong>{" "}
              <span>{formatDate(new Date(user.birthdate))}</span>
            </div>
          </CardContent>
        </Card>

        <SettingsActions user={user} />
      </div>
    </div>
  );
}
