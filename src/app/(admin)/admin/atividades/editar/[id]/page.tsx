import { ActivityForm } from "@/components/activty-form";
import { db } from "@/lib/prisma";

type Params = { params: { id: string } };

export default async function EditActivityPage({ params }: Params) {
  const { id } = await params;
  const [activityData, modules] = await Promise.all([
    db.activity.findUnique({
      include: { module: true },
      where: { id },
    }),
    db.module.findMany({
      include: { archetype: true },
      orderBy: { order: "asc" },
    }),
  ]);

  if (!activityData) return <p>Atividade não encontrada</p>;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Editar Atividade</h1>
      <div className="w-full max-w-md">
        <ActivityForm activity={activityData} modules={modules} />
      </div>
    </div>
  );
}
