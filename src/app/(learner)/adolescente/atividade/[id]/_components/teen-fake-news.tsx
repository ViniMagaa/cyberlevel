"use client";

import { Paragraphs } from "@/components/paragraphs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useActivity } from "@/hooks/use-activity";
import { cn } from "@/lib/utils";
import { TFakeNewsContent } from "@/utils/activity-types";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { Globe, Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type TeenFakeNewsProps = {
  activity: Prisma.ActivityGetPayload<{
    include: {
      activityProgress: true;
    };
  }>;
  primaryColor: string;
  fakeNews: TFakeNewsContent;
  userId: string;
};

export function TeenFakeNews({
  activity,
  primaryColor,
  fakeNews,
  userId,
}: TeenFakeNewsProps) {
  const [isFakeSelected, setIsFakeSelected] = useState<boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { isPending, started, completed, xpEarned, start, complete } =
    useActivity(userId, activity.id);

  function handleAnswer() {
    if (isFakeSelected === null) return;

    setIsCorrect(isFakeSelected === fakeNews.isFake);
  }

  return (
    <div className="grid min-h-screen w-full place-items-center">
      {!started && !completed && (
        <div className="w-full max-w-2xl space-y-12 px-4 text-center">
          <div>
            <h1 className="font-old-english text-5xl md:text-9xl">
              Detectando
            </h1>
            <span className="font-old-english text-4xl leading-8 md:text-8xl">
              mentiras
            </span>
          </div>
          <div>
            <p
              className="text-xl uppercase md:text-2xl"
              style={{ color: primaryColor }}
            >
              Descubra se a notícia é real ou falsa
            </p>
            <p className="text-muted-foreground md:text-md text-sm">
              Esse jogo ensina a identificar fake news. Você vai aprender a
              conferir URLs, analisar a credibilidade do veículo de informação,
              observar imagens suspeitas e perceber quando uma notícia é absurda
              demais para ser verdade.
            </p>
          </div>
          <Button
            onClick={start}
            disabled={isPending}
            size="lg"
            className="text-xl font-bold uppercase"
          >
            Começar
            {isPending && <Loader2Icon className="animate-spin" />}
          </Button>
        </div>
      )}

      {started && !completed && (
        <div className="mx-auto flex max-w-4xl flex-col gap-4 p-4">
          <div className="flex w-full flex-col gap-2 rounded-xl bg-neutral-200 p-4 text-black shadow-2xl">
            <div className="flex items-center gap-2">
              <Globe />
              <div className="flex h-9 w-full items-center rounded-md border border-neutral-400 bg-neutral-300 px-3 py-1 text-base md:text-sm">
                {fakeNews.source}
              </div>
            </div>
            {fakeNews.imageUrl && (
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={fakeNews.imageUrl}
                  alt={fakeNews.title}
                  fill
                  className="rounded-md border border-black object-cover"
                />
              </AspectRatio>
            )}
            <h1 className="text-xl font-extrabold sm:text-4xl">
              {fakeNews.title}
            </h1>
            <Separator className="h-2 bg-black" />
            {fakeNews.subtitle && (
              <h2 className="text-xl">{fakeNews.subtitle}</h2>
            )}
            <div className="text-neutral-900">
              <p className="text-sm font-semibold">
                {fakeNews.author ? fakeNews.author : "Sem autor"}
              </p>
              <p className="text-sm font-semibold">
                {fakeNews.publicationDate
                  ? "Data de publicação: " +
                    format(fakeNews.publicationDate, "dd/MM/yyyy")
                  : "Sem data de publicação"}
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <Paragraphs text={fakeNews.text} className="text-neutral-700" />

              {isCorrect === true && (
                <p className="text-primary-600 text-lg font-extrabold">
                  {fakeNews.feedback}
                </p>
              )}

              {isCorrect === false && (
                <p className="text-lg font-extrabold text-red-700">
                  Tente novamente!
                </p>
              )}

              <div className="flex flex-wrap gap-4 *:flex-1">
                <button
                  disabled={!!isCorrect}
                  onClick={() => setIsFakeSelected(false)}
                  className={cn(
                    "rounded-md px-4 py-2 text-center font-bold text-nowrap outline outline-black transition select-none disabled:opacity-60",
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
                    "rounded-md px-4 py-2 text-center font-bold text-nowrap outline outline-black transition select-none disabled:opacity-60",
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
              className="ml-auto"
              onClick={handleAnswer}
              disabled={isFakeSelected === null || isPending}
            >
              Confirmar {isPending && <Loader2Icon className="animate-spin" />}
            </Button>
          )}

          {isFakeSelected !== null && isCorrect && (
            <Button
              className="ml-auto"
              onClick={complete}
              disabled={isFakeSelected === null || !isCorrect || isPending}
            >
              Finalizar {isPending && <Loader2Icon className="animate-spin" />}
            </Button>
          )}
        </div>
      )}

      {completed && (
        <div className="flex h-full flex-col items-center justify-center space-y-4 px-4 text-center">
          <h2 className="text-4xl font-extrabold md:text-8xl">Parabéns!</h2>
          <p className="none text-xl">
            Você identificou a notícia e ganhou{" "}
            <span className="text-2xl font-bold">{xpEarned} XP</span>
          </p>
          <Link href="/crianca/missoes">
            <Button>Voltar às missões</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
