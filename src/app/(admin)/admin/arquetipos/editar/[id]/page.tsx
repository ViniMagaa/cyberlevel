import { ArchetypeForm } from "@/components/archetype-form";
import { db } from "@/lib/prisma";

type EditArchetypePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditArchetypePage({
  params,
}: EditArchetypePageProps) {
  const { id } = await params;
  const archetype = await db.archetype.findUnique({
    where: { id },
  });

  if (!archetype) return <p>Arquétipo não encontrado</p>;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Editar Arquétipo</h1>
      <div className="w-full max-w-md">
        <ArchetypeForm archetype={archetype} />
      </div>
    </div>
  );
}
