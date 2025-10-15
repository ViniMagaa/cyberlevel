"use client";

import { MagicCard } from "@/components/magicui/magic-card";
import { Card, CardContent } from "@/components/ui/card";
import { ShineBorder } from "@/components/ui/shine-border";
import { activityType } from "@/utils/enums";
import { Prisma } from "@prisma/client";
import { ArrowLeft, BookOpen, BookOpenCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { TeenActivityStatusBadge } from "./teen-activity-status-badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getEnabledActivityId } from "@/utils/activity";

type TeenActivitiesProps = {
  module: Prisma.ModuleGetPayload<{
    include: {
      activities: {
        include: { activityProgress: true };
      };
    };
  }>;
  primaryColor: string;
};

export function TeenActivities({ module, primaryColor }: TeenActivitiesProps) {
  const [selectedActivity, setSelectedActivity] =
    useState<Prisma.ActivityGetPayload<{
      include: { activityProgress: true };
    }> | null>(null);

  const selectedActivityStatus = selectedActivity
    ? selectedActivity.activityProgress.at(0)?.status || "NOT_STARTED"
    : null;

  const enabledActivityId = useMemo(() => {
    const { id } = getEnabledActivityId([module]);
    return id;
  }, [module]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 px-4 pb-4">
      <h2
        className="text-xl font-semibold sm:text-2xl"
        style={{ color: primaryColor }}
      >
        Fragmentos
      </h2>

      <div className="relative sm:grid sm:grid-cols-2 sm:gap-4">
        <div className="space-y-2">
          {module.activities.length > 0 ? (
            module.activities.map((activity) => {
              const status =
                activity.activityProgress.at(0)?.status || "NOT_STARTED";
              return (
                <Card
                  key={activity.id}
                  onClick={() => setSelectedActivity(activity)}
                  className={cn(
                    "relative cursor-pointer border-0 p-0 transition-transform duration-500 hover:scale-102",
                    status === "COMPLETED" && "opacity-50",
                  )}
                >
                  {selectedActivity?.id === activity.id && (
                    <ShineBorder
                      shineColor={[primaryColor, primaryColor, primaryColor]}
                    />
                  )}
                  <MagicCard
                    gradientColor={primaryColor}
                    gradientFrom={primaryColor}
                    gradientTo={primaryColor + "55"}
                    className="flex px-4 py-2 *:flex-1"
                    gradientOpacity={0.25}
                  >
                    <div className="flex h-full w-full items-center gap-4">
                      {status === "COMPLETED" ? (
                        <BookOpenCheck color={primaryColor} />
                      ) : (
                        <BookOpen />
                      )}
                      <div className="flex w-full flex-1 items-center justify-between gap-2">
                        <div>
                          <h3 className="font-medium">{activity.title}</h3>
                          <p className="text-muted-foreground text-sm">
                            {activityType[activity.type]}
                          </p>
                        </div>
                        <TeenActivityStatusBadge
                          status={status}
                          primaryColor={primaryColor}
                        />
                      </div>
                    </div>
                  </MagicCard>
                </Card>
              );
            })
          ) : (
            <p className="text-muted-foreground">Nenhum fragmento encontrado</p>
          )}
        </div>

        <div
          className={cn(
            "fixed inset-4 top-full min-h-96 transition-all duration-700 sm:static",
            !!selectedActivity && "top-4",
          )}
        >
          <div className="sticky top-6 h-full sm:h-auto">
            <Card className="relative z-10 grid h-full place-items-center bg-neutral-950 text-center transition-transform">
              <ShineBorder shineColor={[primaryColor, primaryColor]} />

              <Button
                variant="ghost"
                className="absolute top-4 left-4 sm:hidden"
                onClick={() => setSelectedActivity(null)}
              >
                <ArrowLeft /> Voltar
              </Button>

              <CardContent
                className={cn(
                  "space-y-6 text-center",
                  selectedActivity ? "block" : "hidden sm:block",
                )}
              >
                <div className="space-y-2">
                  <h3
                    className="text-3xl font-bold"
                    style={{ color: primaryColor }}
                  >
                    {selectedActivity
                      ? selectedActivity.title
                      : "Aprendizado através de jogos"}
                  </h3>

                  {selectedActivity ? (
                    <p className="text-muted-foreground text-2xl">
                      {activityType[selectedActivity.type]}
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      Aprender é mais fácil quando você pratica de verdade.
                      Nossos jogos transformam teoria em desafios, ajudando você
                      a reconhecer riscos digitais, evitar armadilhas e testar
                      seus conhecimentos de forma divertida e eficaz.
                    </p>
                  )}
                </div>
                {!selectedActivity && (
                  <p className="text-muted-foreground text-xl font-bold">
                    Selecione um fragmento ao lado
                  </p>
                )}
                {selectedActivity ? (
                  selectedActivityStatus !== "COMPLETED" ? (
                    enabledActivityId === selectedActivity.id ? (
                      <Link
                        href={`/adolescente/atividade/${selectedActivity.id}`}
                      >
                        <Button
                          size="lg"
                          className="text-xl font-bold uppercase"
                        >
                          {selectedActivityStatus === "NOT_STARTED"
                            ? "Iniciar"
                            : "Continuar"}
                        </Button>
                      </Link>
                    ) : (
                      <p className="text-muted-foreground text-xl font-bold">
                        Faça o fragmento anterior
                      </p>
                    )
                  ) : (
                    <div>
                      <p className="text-muted-foreground text-xl font-bold">
                        Fragmento concluído
                      </p>
                      <p>
                        Você ganhou{" "}
                        <span
                          className="text-xl font-extrabold"
                          style={{ color: primaryColor }}
                        >
                          {selectedActivity.activityProgress.at(0)?.xpEarned ||
                            0}{" "}
                          XP
                        </span>
                      </p>
                    </div>
                  )
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
