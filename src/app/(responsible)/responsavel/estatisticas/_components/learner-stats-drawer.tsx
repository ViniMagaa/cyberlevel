import { StreakBadge } from "@/components/streak-badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getLearnerStats } from "@/utils/stats";
import { Avatar, User } from "@prisma/client";
import { ArrowLeft, BookOpen, Sparkles, Timer, Trophy } from "lucide-react";
import Image from "next/image";
import { ChartBarByType } from "./chart-bar-by-type";
import { ChartBarWeekly } from "./chart-bar-weekly";
import { columns } from "./columns";

type LearnerStatsDrawerProps = {
  learner: User & { avatar?: Avatar | null };
};

export default async function LearnerStatsDrawer({
  learner,
}: LearnerStatsDrawerProps) {
  const {
    currentLevel,
    moduleProgress,
    totalTime,
    lastActivitiesProgress,
    ranking,
    weeklyData,
  } = await getLearnerStats(learner.id);

  const modulePercentage =
    (moduleProgress.completed / moduleProgress.total || 0) * 100;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Card className="cursor-pointer bg-neutral-950 transition-all duration-200 hover:scale-102 hover:shadow-md">
          <CardHeader className="flex flex-row items-center gap-3">
            <Card className="w-20 overflow-hidden p-0">
              <AspectRatio ratio={1}>
                <Image
                  src={
                    learner.avatar?.imageUrl ?? "/images/profile-picture.png"
                  }
                  alt={learner.name}
                  fill
                  className="no-blur size-full object-contain"
                />
              </AspectRatio>
            </Card>
            <div>
              <CardTitle className="text-lg break-all">
                {learner.name}
              </CardTitle>
              <p className="text-muted-foreground line-clamp-1 text-sm break-all overflow-ellipsis">
                {learner.email}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen size={16} /> {learner.xp} XP
              </div>
            </div>
          </CardHeader>
        </Card>
      </DrawerTrigger>
      <DrawerContent className="mt-0! h-[95vh] max-h-none!">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold sm:text-4xl">
            Estatísticas de {learner.name}
          </DrawerTitle>
          <DrawerDescription>
            Acompanhe o progresso do aprendiz
          </DrawerDescription>
          <DrawerClose asChild>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 left-2"
            >
              <ArrowLeft />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <ScrollArea className="mb-8 h-[80vh]">
          <div className="mx-auto w-full max-w-7xl space-y-4 px-4 pb-8">
            <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="justify-between gap-2 border-none bg-neutral-900 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen size={18} /> Nível atual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {currentLevel.module ? (
                    <>
                      <div>
                        <p className="font-semibold">{currentLevel.module}</p>
                        {currentLevel.archetype && (
                          <p className="text-muted-foreground text-sm">
                            Arquétipo {currentLevel.archetype}
                          </p>
                        )}
                      </div>
                      <Progress value={modulePercentage} />
                      <p className="text-muted-foreground text-xs">
                        {modulePercentage.toFixed(0)}% do módulo concluído
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Nenhum módulo iniciado
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="justify-between gap-2 border-none bg-neutral-900 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles size={18} /> XP total
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-4xl font-black">{learner.xp} XP</p>
                  <p className="text-muted-foreground text-xs">
                    Experiência obtida ao concluir atividades
                  </p>
                </CardContent>
              </Card>

              <Card className="justify-between gap-2 border-none bg-neutral-900 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer size={18} /> Tempo total
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <StreakBadge userId={learner.id} />
                  <Separator />
                  <p className="text-muted-foreground text-sm">
                    <span className="text-white">{totalTime.formatted}</span> em
                    atividades educativas
                  </p>
                </CardContent>
              </Card>

              <Card className="justify-between gap-2 border-none bg-neutral-900 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy size={18} /> Ranking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-black">
                    {ranking.position}º lugar
                  </p>
                  <p className="text-muted-foreground text-sm">
                    entre {ranking.total} jogadores
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <ChartBarWeekly data={weeklyData} />

              <ChartBarByType data={lastActivitiesProgress} />
            </div>

            <div className="w-[clamp(0px,calc(100vw-2rem),80rem] space-y-2 overflow-x-auto">
              <h2 className="font-bold">Últimas atividades</h2>

              <DataTable
                columns={columns}
                data={lastActivitiesProgress}
                defaultPageSize={6}
              />
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
