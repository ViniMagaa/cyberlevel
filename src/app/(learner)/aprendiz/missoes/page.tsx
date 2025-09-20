import { db } from "@/lib/prisma";
import { ChildModuleView } from "../_components/child-module-view";

export default async function LearnerActivities() {
  const childrenModules = await db.module.findMany({
    include: {
      activities: { orderBy: { order: "asc" } },
    },
    where: { ageGroup: "CHILD" },
    orderBy: { order: "asc" },
  });

  return (
    <section className="bg-primary-900 outline-primary-400/40 flex h-full w-full items-center justify-center overflow-hidden rounded-tl-3xl rounded-bl-3xl outline">
      <ChildModuleView modules={childrenModules} />
    </section>
  );
}
