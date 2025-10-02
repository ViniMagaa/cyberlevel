import { Particles } from "@/components/magicui/particles";
import { getUserSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArchetypeDrawer } from "./_components/archetype-drawer";

export default async function TeenArchetypesPage() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const archetypes = await db.archetype.findMany({
    include: { modules: true },
  });

  return (
    <div className="flex min-h-screen w-full max-w-screen flex-col items-center justify-center gap-12 py-20">
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color="#ffffff"
        refresh
      />
      <h1 className="px-4 text-center text-4xl font-black sm:text-6xl">
        Selecione um arquétipo
      </h1>
      <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-8">
        {archetypes.map((archetype) => (
          <ArchetypeDrawer
            key={archetype.id}
            archetype={archetype}
            userId={user.id}
            selectedArchetypeId={user.currentArchetypeId}
          />
        ))}
      </div>
    </div>
  );
}
