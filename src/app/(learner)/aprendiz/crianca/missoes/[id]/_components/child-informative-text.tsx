"use client";

import { Paragraphs } from "@/components/paragraphs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TInformativeTextContent } from "@/utils/activity-types";
import { activityType } from "@/utils/enums";
import { Prisma } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
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
  const [isPending, startTransition] = useTransition();
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  useEffect(() => {
    if (activity.activityProgress[0]?.status === "COMPLETED") {
      setCompleted(true);
      setXpEarned(activity.activityProgress[0]?.xpEarned);
    }
  }, [activity]);

  function handleStart() {
    startTransition(async () => {
      await fetch("/api/activities/start", {
        method: "POST",
        body: JSON.stringify({ userId, activityId: activity.id }),
      });
      setStarted(true);
    });
  }

  function handleFinish() {
    startTransition(async () => {
      const res = await fetch("/api/activities/complete", {
        method: "POST",
        body: JSON.stringify({ userId, activityId: activity.id }),
      });

      const data = await res.json();
      setXpEarned(data.xpEarned);
      setCompleted(true);
    });
  }

  return (
    <div className="relative h-full w-full">
      <Image
        src="/images/pixel-informative-text-background.png"
        alt="Texto informativo"
        fill
        className="no-blur fixed top-0 left-0 -z-10 object-cover brightness-90"
      />
      <div className="flex h-full w-full flex-col items-center gap-10 px-4 py-10 sm:gap-20 md:flex-row md:justify-center">
        {(!started || completed) && (
          <Image
            src="/images/pixel-book.png"
            alt="Livro"
            width={300}
            height={400}
            className="no-blur"
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
              onClick={handleStart}
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
                  <div className="prose prose-neutral dark:prose-invert">
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
                      className="font-monocraft"
                      onClick={handleFinish}
                      disabled={isPending}
                    >
                      Concluir leitura
                      {isPending && <Loader2Icon className="animate-spin" />}
                    </Button>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}

        {completed && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h2 className="font-upheaval text-4xl md:text-6xl">Parabéns!</h2>
            <p className="font-monocraft text-xl leading-none">
              Você concluiu a leitura e ganhou{" "}
              <span className="font-upheaval text-4xl">{xpEarned} XP</span>
            </p>
<<<<<<<< HEAD:src/app/(learner)/crianca/missoes/[id]/_components/child-informative-text.tsx
            <Link href="/crianca/missoes">
========
            <Link href="/aprendiz/crianca/missoes">
>>>>>>>> 774d0193b4bae464265fff6bb89c0711d3c7c445:src/app/(learner)/aprendiz/crianca/missoes/[id]/_components/child-informative-text.tsx
              <Button className="font-monocraft mt-4">Voltar às missões</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
