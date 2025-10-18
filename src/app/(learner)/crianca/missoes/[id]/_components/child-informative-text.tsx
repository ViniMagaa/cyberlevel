"use client";

import { Paragraphs } from "@/components/paragraphs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useActivity } from "@/hooks/use-activity";
import { TInformativeTextContent } from "@/utils/activity-types";
import { activityType } from "@/utils/enums";
import { Prisma } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChildInformativeTextProps = {
  activity: Prisma.ActivityGetPayload<{
    include: { activityProgress: true };
  }>;
  informativeText: TInformativeTextContent;
  userId: string;
};

export function ChildInformativeText({
  activity,
  informativeText,
  userId,
}: ChildInformativeTextProps) {
  const { isPending, started, completed, xpEarned, start, complete } =
    useActivity(userId, activity.id);

  return (
    <div className="h-full w-full">
      <Image
        src="/images/pixel-informative-text-background.png"
        alt="Texto informativo"
        fill
        className="no-blur fixed -z-10 object-cover brightness-90"
      />
      <div className="flex h-full w-full flex-col items-center gap-10 px-4 py-10 sm:gap-20 md:flex-row md:justify-center">
        {(!started || completed) && (
          <Image
            src="/images/pixel-book.png"
            alt="Livro"
            width={300}
            height={400}
            className="no-blur max-sm:w-40"
          />
        )}

        {!started && !completed && (
          <div className="max-w-2xl text-center">
            <h1 className="font-upheaval text-4xl md:text-7xl">
              {activityType[activity.type]}
            </h1>
            <p className="font-monocraft text-xl md:text-3xl">
              Leia com atenção para aprender!
            </p>
            <Button
              onClick={start}
              disabled={isPending}
              className="font-monocraft mt-4"
            >
              Iniciar
              {isPending && <Loader2Icon className="animate-spin" />}
            </Button>
          </div>
        )}

        {started && !completed && (
          <div className="w-full max-w-3xl space-y-4">
            <div>
              <h2 className="font-upheaval text-3xl">
                {informativeText.title}
              </h2>
              {informativeText.description && (
                <Paragraphs
                  className="font-monocraft text-white/80"
                  text={informativeText.description}
                />
              )}
            </div>
            <Card>
              <CardContent className="space-y-4 p-4">
                <ScrollArea className="h-[60vh]">
                  <div className="flex min-h-[60vh] flex-col justify-between gap-2">
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
                    <div className="flex justify-end">
                      <Button
                        className="font-monocraft"
                        onClick={complete}
                        disabled={isPending}
                      >
                        Concluir leitura
                        {isPending && <Loader2Icon className="animate-spin" />}
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}

        {completed && (
          <div className="flex max-w-70 flex-col items-center justify-center text-center sm:max-w-md">
            <h2 className="font-upheaval text-3xl sm:text-5xl md:text-6xl">
              Parabéns!
            </h2>
            <p className="font-monocraft text-sm sm:text-xl sm:leading-none">
              Você completou a atividade e ganhou{" "}
              <span className="font-upheaval text-xl sm:text-4xl">
                {xpEarned} XP
              </span>
            </p>
            <Link href="/crianca/missoes">
              <Button className="font-monocraft mt-4">Voltar às missões</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
