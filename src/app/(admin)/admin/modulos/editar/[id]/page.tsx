import { ModuleForm } from "@/components/module-form";
import { db } from "@/lib/prisma";

type EditModulePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditModulePage({ params }: EditModulePageProps) {
  const { id } = await params;
  const [moduleData, archetypes] = await Promise.all([
    db.module.findUnique({
      where: { id },
    }),
    db.archetype.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!moduleData) return <p>Módulo não encontrado</p>;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Editar Módulo</h1>
      <div className="w-full max-w-md">
        <ModuleForm module={moduleData} archetypes={archetypes} />
      </div>
    </div>
  );
}
