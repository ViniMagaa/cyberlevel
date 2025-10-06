import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getUserSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TeenHeader } from "./_components/teen-header";

export default async function Dashboard() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const archetype = user?.currentArchetype;
  if (!archetype) return redirect("/adolescente/arquetipos");

  const modules = await db.module.findMany({
    where: { archetypeId: archetype.id },
    include: {
      activities: {
        orderBy: { order: "asc" },
        include: {
          activityProgress: { where: { userId: user.id } },
        },
      },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen w-full">
      <TeenHeader user={user} archetype={archetype} />

      <section className="border-t- relative z-20 flex h-full w-full flex-col items-center gap-20 overflow-hidden border-t px-8 py-20">
        <div
          className="absolute top-0 -z-10 h-[1px] w-full overflow-hidden"
          style={{
            backgroundColor: archetype.primaryColor,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 -z-20 animate-[pulse_5s_ease-in-out_infinite] rounded-[inherit] opacity-20"
          style={{
            background: `linear-gradient(to bottom, ${archetype.primaryColor} 5%, ${archetype.primaryColor}55, transparent 40%)`,
          }}
        />
        <div className="space-y-8">
          <h2 className="text-center text-3xl font-bold sm:text-5xl">
            Módulos de treinamento
          </h2>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
            {modules.map((module) => {
              const isStarted = module.activities.some(
                (activity) =>
                  activity?.activityProgress?.at(0)?.status === "COMPLETED",
              );
              const isCompleted =
                isStarted &&
                module.activities.every(
                  (activity) =>
                    activity?.activityProgress?.at(0)?.status === "COMPLETED",
                );
              return (
                <Link key={module.id} href={`/adolescente/modulo/${module.id}`}>
                  <Card
                    className={cn(
                      "relative flex h-full flex-col items-center gap-2 p-4 transition duration-500 hover:scale-95 sm:p-6",
                      !isStarted && "sm:blur-xs sm:hover:blur-none",
                    )}
                  >
                    {!isStarted ? (
                      module.iconUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={module.iconUrl}
                          alt={module.title}
                          width={32}
                          height={32}
                          className="absolute top-4 right-4 max-w-8 object-contain object-center"
                        />
                      )
                    ) : (
                      <div className="flex w-full items-center justify-between">
                        <Badge
                          style={{
                            backgroundColor: isCompleted
                              ? archetype.primaryColor
                              : "",
                          }}
                          variant={isCompleted ? "default" : "secondary"}
                          className="font-bold"
                        >
                          {isCompleted
                            ? "Módulo finalizado"
                            : "Continue de onde parou"}
                        </Badge>
                        {module.iconUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={module.iconUrl}
                            alt={module.title}
                            width={32}
                            height={32}
                            className="max-w-8 object-contain object-center"
                          />
                        )}
                      </div>
                    )}
                    <div className="flex flex-1 flex-col justify-center gap-2">
                      <h3 className="mr-8 text-2xl font-bold">
                        {module.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {module.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
