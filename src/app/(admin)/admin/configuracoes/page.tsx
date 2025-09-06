import { formatDate } from "@/utils/format-date";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "./actions";
import { SettingsActions } from "./_components/settings-actions";

export default async function Settings() {
  const supabase = await createClient();
  const {
    data: { user: userData },
  } = await supabase.auth.getUser();

  if (!userData) return <p>Usuário não encontrado</p>;

  const user = await getUser(userData.id);

  if (!user) return <p>Usuário não encontrado</p>;

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex w-full flex-wrap justify-start gap-4">
        <h1 className="text-4xl font-bold">Configurações</h1>
      </div>

      <div className="flex flex-col gap-2">
        <p>
          <strong>Nome:</strong> {user.name}
        </p>
        <p>
          <strong>Nome de usuário:</strong> {user.username}
        </p>
        <p>
          <strong>E-mail:</strong> {user.email}
        </p>
        <p>
          <strong>Nascimento:</strong> {formatDate(user.birthdate)}
        </p>
      </div>

      <SettingsActions user={user} />
    </div>
  );
}
