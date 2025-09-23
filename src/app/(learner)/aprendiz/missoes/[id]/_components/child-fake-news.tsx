"use client";

import { Paragraphs } from "@/components/paragraphs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TFakeNewsContent } from "@/utils/activity-types";
import { Prisma } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

type ChildFakeNewsProps = {
  activity: Prisma.ActivityGetPayload<{
    include: {
      activityProgress: true;
    };
  }>;
  fakeNews: TFakeNewsContent;
  userId: string;
};

export function ChildFakeNews({
  activity,
  fakeNews,
  userId,
}: ChildFakeNewsProps) {
  const [isPending, startTransition] = useTransition();
  const [started, setStarted] = useState(false);
  const [isFakeSelected, setIsFakeSelected] = useState<boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
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

  function handleAnswer() {
    if (isFakeSelected === null) return;

    setIsCorrect(isFakeSelected === fakeNews.isFake);
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
        src="/images/pixel-fake-news-background.png"
        alt="Fake News"
        fill
        className="no-blur fixed top-0 left-0 -z-10 object-cover brightness-90"
      />
      <div className="flex h-full w-full flex-col items-center gap-10 px-4 py-15 sm:gap-20 md:flex-row md:justify-center">
        {(!started || completed) && (
          <Image
            src="/images/pixel-newspaper.png"
            alt="Jornal"
            width={400}
            height={381}
            className="no-blur size-50 md:size-80"
          />
        )}

        {!started && !completed && (
          <div className="max-w-2xl text-center">
            <h1 className="font-upheaval text-4xl md:text-7xl">
              Detectando mentiras
            </h1>
            <p className="font-monocraft text-xl md:text-3xl">
              Simulação de jornal online
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
          <div className="flex flex-col gap-4">
            <div className="flex w-full max-w-2xl flex-col gap-2 border-6 border-black bg-neutral-200 p-4 text-black shadow-2xl">
              <div className="font-monocraft border-2 border-black bg-neutral-300 px-2 py-1 overflow-ellipsis">
                {fakeNews.source}
              </div>
              {fakeNews.imageUrl && (
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={fakeNews.imageUrl}
                    alt={fakeNews.title}
                    fill
                    className="border border-black object-cover"
                  />
                </AspectRatio>
              )}
              <h1 className="font-upheaval text-4xl">{fakeNews.title}</h1>
              <Separator className="h-2 bg-black" />
              {fakeNews.subtitle && (
                <h2 className="font-monocraft text-xl">{fakeNews.subtitle}</h2>
              )}
              <div className="flex flex-col gap-6">
                <Paragraphs text={fakeNews.text} className="text-neutral-700" />

                {isCorrect === true && (
                  <p className="font-monocraft text-primary-600 text-lg">
                    {fakeNews.feedback}
                  </p>
                )}

                {isCorrect === false && (
                  <p className="font-monocraft text-lg text-red-700">
                    Tente novamente!
                  </p>
                )}

                <div className="flex gap-4 *:flex-1">
                  <button
                    disabled={!!isCorrect}
                    onClick={() => setIsFakeSelected(false)}
                    className={cn(
                      "font-monocraft px-4 py-2 text-center font-bold outline outline-black transition select-none disabled:opacity-60",
                      !isCorrect &&
                        "hover:text-primary-600 hover:outline-primary-600 cursor-pointer",
                      isFakeSelected === false &&
                        !isCorrect &&
                        "bg-primary-600 hover:bg-primary-700/80 hover:text-black hover:outline-black",
                    )}
                  >
                    Notícia verdadeira
                  </button>
                  <button
                    disabled={!!isCorrect}
                    onClick={() => setIsFakeSelected(true)}
                    className={cn(
                      "font-monocraft px-4 py-2 text-center font-bold outline outline-black transition select-none disabled:opacity-60",
                      !isCorrect &&
                        "cursor-pointer hover:text-red-900/90 hover:outline-red-900/90",
                      isFakeSelected &&
                        !isCorrect &&
                        "bg-red-900/90 text-white hover:bg-red-900/80 hover:text-white hover:outline-black",
                    )}
                  >
                    Notícia falsa
                  </button>
                </div>
              </div>
            </div>
            {!isCorrect && (
              <Button
                className="font-monocraft ml-auto"
                onClick={handleAnswer}
                disabled={isFakeSelected === null || isPending}
              >
                Confirmar{" "}
                {isPending && <Loader2Icon className="animate-spin" />}
              </Button>
            )}

            {isFakeSelected !== null && isCorrect && (
              <Button
                className="font-monocraft ml-auto"
                onClick={handleFinish}
                disabled={isFakeSelected === null || !isCorrect || isPending}
              >
                Finalizar{" "}
                {isPending && <Loader2Icon className="animate-spin" />}
              </Button>
            )}
          </div>
        )}

        {completed && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h2 className="font-upheaval text-6xl md:text-6xl">Parabéns!</h2>
            <p className="font-monocraft text-xl leading-none">
              Você identificou a notícia e ganhou{" "}
              <span className="font-upheaval text-4xl">{xpEarned} XP</span>
            </p>
            <Link href="/aprendiz/missoes">
              <Button className="font-monocraft mt-4">Voltar às missões</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
