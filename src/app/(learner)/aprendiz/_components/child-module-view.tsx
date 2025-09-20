"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

type ChildModuleViewProps = {
  modules: Prisma.ModuleGetPayload<{ include: { activities: true } }>[];
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
          className={`flex h-[calc(${selectedModule.activities.length.toString()}*(160px+5rem)+5rem+12rem)] flex-col items-center gap-20 py-30 sm:h-screen sm:w-[calc(${selectedModule.activities.length.toString()}*(160px+5rem)+5rem+12rem)] sm:flex-row sm:py-0 sm:pl-20`}
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
          {selectedModule.activities.map((activity, index) => (
            <div key={activity.id} className="shrink-0 scale-75 sm:scale-100">
              <Image
                src={selectedModule.pixelIslandImageUrl!}
                alt={activity.title}
                width={160}
                height={110}
                className={cn(
                  "no-blur animate-float-diagonal brightness-80 drop-shadow-xl/25 transition select-none hover:scale-105 hover:brightness-100",
                  index % 2 === 0 ? "sm:mt-12" : "sm:mb-12",
                )}
                style={{
                  animationDelay: `${index * 300}ms`,
                  animationDuration: `${3000 + index * 500}ms`,
                }}
              />
            </div>
          ))}
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
