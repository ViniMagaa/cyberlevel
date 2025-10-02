import { getUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TeenHeader } from "./_components/teen-header";

export default async function Dashboard() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const archetype = user?.currentArchetype;
  if (!archetype) return redirect("/adolescente/arquetipos");

  return (
    <div>
      <TeenHeader user={user} archetypeName={archetype.name} />
    </div>
  );
}
