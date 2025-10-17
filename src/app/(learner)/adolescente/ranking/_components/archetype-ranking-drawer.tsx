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
import { Prisma } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { RankingList } from "./ranking-list";

type ArchetypeRankingDrawerProps = {
  archetype: Prisma.ArchetypeGetPayload<{
    include: { users: { include: { avatar: true; ActivityProgress: true } } };
  }>;
  userId: string;
};

export function ArchetypeRankingDrawer({
  archetype,
  userId,
}: ArchetypeRankingDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger>
        <div className="group relative flex max-w-xl flex-col items-center gap-4">
          <Card className="h-80 p-0 transition-transform duration-500 group-hover:scale-90">
            <MagicCard
              gradientColor={archetype.primaryColor}
              gradientFrom={archetype.primaryColor}
              gradientTo={archetype.primaryColor + "55"}
              className="h-80 p-0"
              gradientOpacity={0.25}
              style={{
                backgroundColor: archetype.primaryColor,
              }}
            >
              {archetype.imageUrl && (
                <Image
                  src={archetype.imageUrl}
                  alt={archetype.name}
                  width={250}
                  height={250}
                  className="mt-auto h-80 object-contain object-bottom transition-transform duration-500 group-hover:-translate-y-4 group-hover:scale-125"
                />
              )}
            </MagicCard>
          </Card>
          <h2
            className="text-3xl font-extrabold transition duration-500 group-hover:translate-y-2 group-hover:scale-110"
            style={{
              color: archetype.primaryColor,
            }}
          >
            {archetype.name}
          </h2>
        </div>
      </DrawerTrigger>
      <DrawerContent className="mt-0! h-[100vh] max-h-none!">
        <DialogTitle className="hidden">{archetype.name}</DialogTitle>
        <DrawerClose asChild>
          <Button variant="ghost" className="ml-4 w-fit">
            <ArrowLeft /> Voltar
          </Button>
        </DrawerClose>
        <ScrollArea className="h-[100vh]">
          <div className="flex flex-col items-center justify-center overflow-hidden px-4 sm:flex-row">
            <h1
              className="text-center text-6xl font-black sm:text-8xl"
              style={{
                color: archetype.primaryColor,
              }}
            >
              {archetype.name}
            </h1>
            <div>
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

          <section className="border-t- relative z-20 mb-14 flex h-[90vh] w-screen flex-col items-center justify-center gap-8 overflow-hidden border-t p-8 text-center">
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

            <h2 className="text-center text-4xl font-extrabold">Ranking</h2>

            <RankingList
              users={archetype.users}
              userId={userId}
              showArchetypeName={false}
            />
          </section>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
