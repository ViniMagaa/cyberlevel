import { Prisma } from "@prisma/client";

export function getEnabledActivityId(
  modules: Prisma.ModuleGetPayload<{
    include: { activities: { include: { activityProgress: true } } };
  }>[],
) {
  let id: string | undefined;
  let moduleIndex: number | undefined;
  for (let i = 0; i < modules.length; i++) {
    const mod = modules[i];
    const activity = mod.activities.find((act) => {
      const progress = act.activityProgress[0]; // pega o progresso do usuário ou undefined
      return !progress || progress.status !== "COMPLETED";
    });

    if (activity) {
      id = activity.id;
      moduleIndex = i;
      break; // achou a primeira, sai do loop
    }
  }
  return { id, moduleIndex };
}
