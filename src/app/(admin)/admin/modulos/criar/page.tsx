import { ModuleForm } from "@/components/module-form";
import { db } from "@/lib/prisma";

export default async function CreateModulePage() {
  const archetypes = await db.archetype.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Criar Módulo</h1>
      <div className="w-full max-w-md">
        <ModuleForm archetypes={archetypes} />
      </div>
    </div>
  );
}
