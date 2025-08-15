import { ActivityForm } from "@/components/activty-form";
import { db } from "@/lib/prisma";

export default async function CreateActivityPage() {
  const modules = await db.module.findMany({
    include: { archetype: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Criar Atividade</h1>
      <div className="w-full max-w-md">
        <ActivityForm modules={modules} />
      </div>
    </div>
  );
}
