"use client";

import { MagicCard } from "@/components/magicui/magic-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { ArrowLeft, Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { selectArchetype } from "../actions";

type ArchetypeDrawerProps = {
  archetype: Prisma.ArchetypeGetPayload<{ include: { modules: true } }>;
  userId: string;
  selectedArchetypeId: string | null;
};

export function ArchetypeDrawer({
  archetype,
  userId,
  selectedArchetypeId,
}: ArchetypeDrawerProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSelectArchetype(id: string) {
    startTransition(async () => {
      try {
        await selectArchetype(id, userId);
        router.push("/adolescente");
      } catch (error) {
        console.error(error);
        toast.error("Erro ao selecionar arquétipo");
      }
    });
  }

  const isSelected = archetype.id === selectedArchetypeId;

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="group relative flex max-w-xl flex-col items-center gap-4">
          <Card
            className={cn(
              "h-80 p-0 transition-transform duration-500 group-hover:scale-90",
              isSelected && "scale-90",
            )}
          >
            <MagicCard
              gradientColor="#2db780"
              gradientFrom="#2db780"
              gradientTo="#1a8f6b"
              className={cn("h-80 p-0", isSelected && "bg-primary-500")}
              gradientOpacity={0.25}
            >
              {archetype.imageUrl && (
                <Image
                  src={archetype.imageUrl}
                  alt={archetype.name}
                  width={250}
                  height={250}
                  className={cn(
                    "mt-auto h-80 object-contain object-bottom transition-transform duration-500 group-hover:-translate-y-4 group-hover:scale-125",
                    isSelected && "-translate-y-4 scale-125",
                  )}
                />
              )}
            </MagicCard>
          </Card>
          <h2
            className={cn(
              "group-hover:text-primary-400 text-3xl font-extrabold transition duration-500 group-hover:translate-y-2 group-hover:scale-110",
              isSelected && "text-primary-400 translate-2 scale-110",
            )}
          >
            {archetype.name}
          </h2>
        </div>
      </DrawerTrigger>
      <DrawerContent className="mt-0! h-[95vh] max-h-none!">
        <DialogTitle className="hidden">{archetype.name}</DialogTitle>
        <DrawerClose asChild>
          <Button variant="ghost" className="ml-4 w-fit">
            <ArrowLeft /> Voltar
          </Button>
        </DrawerClose>
        <ScrollArea className="mb-8 h-[95vh]">
          <div className="flex flex-col items-center gap-12 p-8">
            <h1 className="text-primary-400 text-center text-6xl font-black sm:text-8xl">
              {archetype.name}
            </h1>
            <div className="flex w-full max-w-5xl flex-wrap items-center justify-between gap-8">
              <p className="text-muted-foreground max-w-xl text-center text-lg sm:text-left sm:text-2xl">
                {archetype.description}
              </p>
              <div className="m-auto">
                {archetype.imageUrl && (
                  <Image
                    src={archetype.imageUrl}
                    alt={archetype.name}
                    width={250}
                    height={250}
                    className="m-auto h-[350px] object-contain transition-transform duration-500 hover:scale-115"
                  />
                )}
              </div>
            </div>

            <h2 className="text-center text-4xl font-extrabold">
              Módulos disponíveis
            </h2>

            <div className="grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
              {archetype.modules.map((module) => (
                <Card
                  key={module.id}
                  className="p-0 transition-transform duration-500 group-hover:scale-90"
                >
                  <MagicCard
                    gradientColor="#2db780"
                    gradientFrom="#2db780"
                    gradientTo="#1a8f6b"
                    className="flex-1 p-4 sm:p-8"
                    gradientOpacity={0.25}
                  >
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">{module.title}</h3>
                      <p className="text-muted-foreground">
                        {module.description}
                      </p>
                    </div>
                  </MagicCard>
                </Card>
              ))}
            </div>

            <p className="text-muted-foreground text-center text-sm">
              Ao finalizar todos os módulos de um arquétipo, você poderá iniciar
              outra jornada com um arquétipo diferente
            </p>
          </div>

          <section className="border-t- relative z-20 flex h-[90vh] w-screen flex-col items-center justify-center gap-20 overflow-hidden border-t px-8 text-center">
            <div className="bg-primary-500 absolute top-0 -z-10 h-[1px] w-full overflow-hidden" />
            <div
              className="pointer-events-none absolute inset-0 -z-20 animate-[pulse_5s_ease-in-out_infinite] rounded-[inherit] opacity-20"
              style={{
                background:
                  "linear-gradient(to bottom, #2db78099 5%, #1a8f6b55, transparent 40%)",
              }}
            />
            <div className="space-y-4">
              <h2 className="max-w-2xl text-3xl font-extrabold sm:text-5xl">
                {isSelected ? "Continue" : "Pronto para começar"} sua jornada
                com <span className="text-primary-400">{archetype.name}</span>
                {!isSelected && "?"}
              </h2>
              {!isSelected && (
                <p className="text-muted-foreground">
                  Junte-se ao CyberLevel e desbloqueie todo o potencial do seu
                  arquétipo
                </p>
              )}
            </div>
            {isSelected ? (
              <Link href="/adolescente">
                <Button className="bg-primary-500 shadow-primary-500/25 hover:bg-primary-200 font-extrabold text-wrap uppercase shadow-lg hover:scale-105 sm:p-6 sm:text-xl md:p-8 md:text-3xl">
                  Continuar treinamento
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => handleSelectArchetype(archetype.id)}
                disabled={isPending}
                className="bg-primary-500 shadow-primary-500/25 hover:bg-primary-200 font-extrabold text-wrap uppercase shadow-lg hover:scale-105 sm:p-6 sm:text-xl md:p-8 md:text-3xl"
              >
                Começar treinamento
                {isPending && (
                  <Loader2Icon className="animate-spin sm:size-8" />
                )}
              </Button>
            )}
          </section>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
