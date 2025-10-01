import { getUserSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ChildModuleView } from "../_components/child-module-view";

export default async function LearnerActivities() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const childrenModules = await db.module.findMany({
    include: {
      activities: {
        orderBy: { order: "asc" },
        include: {
          activityProgress: {
            where: { userId: user.id },
          },
        },
      },
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
