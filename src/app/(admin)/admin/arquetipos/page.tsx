import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";
import Link from "next/link";
import { ArchetypeCard } from "./_components/archetype-card";

export default async function Archetypes() {
  const archetypes = await db.archetype.findMany({
    include: {
      modules: {
        include: {
          _count: true,
          activities: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex w-full flex-wrap justify-between gap-4">
        <h1 className="text-4xl font-bold">Arquétipos</h1>
        <Button type="button" asChild>
          <Link href="/admin/arquetipos/criar">Criar arquétipo</Link>
        </Button>
      </div>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {archetypes.map((archetype) => (
          <ArchetypeCard key={archetype.id} archetype={archetype} />
        ))}
      </section>
    </div>
  );
}
