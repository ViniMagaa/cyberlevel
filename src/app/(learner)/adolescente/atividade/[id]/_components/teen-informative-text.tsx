"use client";

import Aurora from "@/components/aurora";
import { Paragraphs } from "@/components/paragraphs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useActivity } from "@/hooks/use-activity";
import { TInformativeTextContent } from "@/utils/activity-types";
import { activityType } from "@/utils/enums";
import { Prisma } from "@prisma/client";
import { ChevronsRight, Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type TeenInformativeTextProps = {
  activity: Prisma.ActivityGetPayload<{
    include: { activityProgress: true };
  }>;
  primaryColor: string;
  informativeText: TInformativeTextContent;
  userId: string;
};

export function TeenInformativeText({
  activity,
  primaryColor,
  informativeText,
  userId,
}: TeenInformativeTextProps) {
  const { isPending, started, completed, xpEarned, start, complete } =
    useActivity(userId, activity.id);

  return (
    <div className="relative grid min-h-screen w-full place-items-center">
      <div className="fixed top-0 left-0 -z-10 h-screen w-screen">
        <Aurora
          colorStops={[primaryColor, primaryColor, primaryColor]}
          blend={0.5}
          amplitude={0.5}
          speed={0.5}
        />
      </div>

      {!started && !completed && (
        <div className="w-full max-w-3xl space-y-12 px-4 text-center">
          <h1 className="text-5xl font-black uppercase md:text-8xl">
            {activityType[activity.type]}
          </h1>
          <div className="mx-auto max-w-md">
            <p
              className="text-xl uppercase md:text-2xl"
              style={{ color: primaryColor }}
            >
              {informativeText.title}
            </p>
            <p className="text-muted-foreground md:text-md text-sm">
              Leia um conteúdo rápido e direto sobre segurança digital. Entenda
              o tema e prepare-se para as próximas atividades!
            </p>
          </div>
          <Button
            onClick={start}
            disabled={isPending}
            size="lg"
            className="text-xl font-bold uppercase"
          >
            Começar
            {isPending ? (
              <Loader2Icon className="size-6 animate-spin" />
            ) : (
              <ChevronsRight className="size-7" />
            )}
          </Button>
        </div>
      )}

      {started && !completed && (
        <div className="w-full max-w-3xl space-y-4 p-4">
          <div>
            <h2 className="text-3xl font-extrabold">{informativeText.title}</h2>
            {informativeText.description && (
              <Paragraphs
                className="font-semibold text-white/80"
                text={informativeText.description}
              />
            )}
          </div>
          <Card className="p-6">
            <CardContent className="space-y-4 p-0">
              <ScrollArea className="h-[60vh]">
                {informativeText.imageUrl && (
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={informativeText.imageUrl}
                      alt={informativeText.title}
                      fill
                      className="rounded-md object-cover"
                    />
                  </AspectRatio>
                )}
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: (props) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                    }}
                  >
                    {informativeText.content}
                  </Markdown>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    size="lg"
                    className="text-xl font-bold uppercase"
                    onClick={complete}
                    disabled={isPending}
                  >
                    Concluir leitura
                    {isPending && (
                      <Loader2Icon className="size-6 animate-spin" />
                    )}
                  </Button>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {completed && (
        <div className="flex h-full flex-col items-center justify-center space-y-4 px-4 text-center">
          <h2 className="text-4xl font-extrabold md:text-8xl">Parabéns!</h2>
          <p className="text-xl">
            Você concluiu a leitura e ganhou{" "}
            <span className="text-2xl font-bold">{xpEarned} XP</span>
          </p>
          <Link href={`/adolescente/modulo/${activity.moduleId}`}>
            <Button size="lg" className="text-xl font-bold uppercase">
              Voltar às missões
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
