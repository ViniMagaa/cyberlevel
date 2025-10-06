"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ChildActivityIsland } from "./child-activity-island";
import { getEnabledActivityId } from "@/utils/activity";

type ChildModuleViewProps = {
  modules: Prisma.ModuleGetPayload<{
    include: { activities: { include: { activityProgress: true } } };
  }>[];
};

export function ChildModuleView({ modules }: ChildModuleViewProps) {
  const [moduleIndex, setModuleIndex] = useState(0);

  function prevModule() {
    setModuleIndex((prev) => prev - 1);
  }
  function nextModule() {
    setModuleIndex((prev) => prev + 1);
  }

  const selectedModule = modules[moduleIndex];

  const enabledActivityId = useMemo(() => {
    const { id, moduleIndex } = getEnabledActivityId(modules);
    if (moduleIndex) setModuleIndex(moduleIndex);
    return id;
  }, [modules]);

  return modules.length > 0 ? (
    <div className="outline-primary-400/40 relative ml-20 h-screen w-full overflow-hidden rounded-tl-3xl rounded-bl-3xl outline">
      <Image
        src={selectedModule.pixelBackgroundImageUrl!}
        alt={selectedModule.title}
        fill
        className="no-blur fixed object-cover blur-xs brightness-50"
      />

      <div className="fixed top-4 left-28 z-10">
        <h1 className="font-upheaval text-4xl">{selectedModule.title}</h1>
        <p className="text-muted-foreground font-monocraft text-sm">
          {selectedModule.description}
        </p>
      </div>

      <ScrollArea className="max-sm:h-screen">
        <div
          className={`flex h-[calc(${selectedModule.activities.length.toString()}*15rem+17rem)] flex-col items-center gap-20 pt-60 pb-30 sm:h-screen sm:w-[calc(${selectedModule.activities.length.toString()}*15rem+17rem)] sm:flex-row sm:py-0 sm:pl-20`}
        >
          {moduleIndex > 0 && (
            <Button
              variant="pixel"
              size="pixel"
              className="font-monocraft shrink-0"
              onClick={prevModule}
            >
              Anterior
            </Button>
          )}
          {selectedModule.activities.map((activity, index) => {
            const userProgress = activity.activityProgress[0];
            return (
              <ChildActivityIsland
                key={activity.id}
                enabled={activity.id === enabledActivityId}
                activity={activity}
                userProgress={userProgress}
                islandImageUrl={selectedModule.pixelIslandImageUrl!}
                index={index}
              />
            );
          })}
          {moduleIndex < modules.length - 1 && (
            <Button
              variant="pixel"
              size="pixel"
              className="font-monocraft shrink-0"
              onClick={nextModule}
            >
              Próximo
            </Button>
          )}
        </div>
        <ScrollBar className="hidden sm:flex" orientation="horizontal" />
        <ScrollBar className="flex sm:hidden" orientation="vertical" />
      </ScrollArea>
    </div>
  ) : (
    <div className="inset-0 grid place-items-center">
      <p className="text-muted-foreground font-semibold">
        Módulo não encontrado
      </p>
    </div>
  );
}
