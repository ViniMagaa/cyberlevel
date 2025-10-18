"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useActivity } from "@/hooks/use-activity";
import { cn } from "@/lib/utils";
import { TPostOrNotContent } from "@/utils/activity-types";
import { activityType } from "@/utils/enums";
import { Prisma } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type ChildPostOrNotProps = {
  activity: Prisma.ActivityGetPayload<{
    include: { activityProgress: true };
  }>;
  postOrNot: TPostOrNotContent;
  userId: string;
};

export function ChildPostOrNot({
  activity,
  postOrNot,
  userId,
}: ChildPostOrNotProps) {
  const [selected, setSelected] = useState<"post" | "not" | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { isPending, started, completed, xpEarned, start, complete } =
    useActivity(userId, activity.id);

  function handleAnswer(choice: "post" | "not") {
    setSelected(choice);

    const correct =
      (choice === "post" && postOrNot.isSafe) ||
      (choice === "not" && !postOrNot.isSafe);

    setFeedback(
      correct
        ? postOrNot.justification
        : "Ops, não é a melhor decisão. Tente novamente!",
    );
  }

  return (
    <div className="h-full w-full">
      <Image
        src="/images/pixel-post-or-not-background.png"
        alt="Postar ou Não Postar"
        fill
        className="no-blur fixed -z-10 object-cover brightness-90"
      />
      <div className="flex h-full w-full flex-col items-center gap-10 px-4 py-10 sm:gap-20 md:flex-row md:justify-center">
        {(!started || completed) && (
          <Image
            src="/images/pixel-social-media.png"
            alt="Mídia Social"
            width={560}
            height={470}
            className="no-blur size-50 object-contain md:size-80"
          />
        )}

        {!started && !completed && (
          <div className="max-w-2xl text-center">
            <h1 className="font-upheaval text-4xl md:text-6xl">
              {activityType[activity.type]}
            </h1>
            <p className="font-monocraft text-xl md:text-3xl">
              Decida se deve postar ou não!
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
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="font-upheaval text-2xl font-normal">
                {postOrNot.title}
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col gap-6">
              {postOrNot.imageUrl && (
                <AspectRatio ratio={1 / 1}>
                  <Image
                    src={postOrNot.imageUrl}
                    alt={postOrNot.title}
                    fill
                    className="rounded-md object-cover"
                  />
                </AspectRatio>
              )}

              <p className="font-monocraft text-lg">{postOrNot.description}</p>

              <div className="flex flex-wrap gap-3 *:flex-1">
                <Button
                  onClick={() => handleAnswer("post")}
                  disabled={
                    selected !== null && postOrNot.isSafe
                      ? selected === "post"
                      : selected === "not"
                  }
                  variant="outline"
                  className={cn(
                    "font-monocraft",
                    selected === "post"
                      ? postOrNot.isSafe
                        ? "bg-primary-600!"
                        : "bg-destructive/60!"
                      : "",
                  )}
                >
                  Postar
                </Button>
                <Button
                  onClick={() => handleAnswer("not")}
                  disabled={
                    selected !== null && postOrNot.isSafe
                      ? selected === "post"
                      : selected === "not"
                  }
                  variant="outline"
                  className={cn(
                    "font-monocraft",
                    selected === "not"
                      ? !postOrNot.isSafe
                        ? "bg-primary-600!"
                        : "bg-destructive/60!"
                      : "",
                  )}
                >
                  Não Postar
                </Button>
              </div>

              {feedback && (
                <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                  <p
                    className={cn(
                      "font-monocraft text-lg",
                      (selected === "post" && postOrNot.isSafe) ||
                        (selected === "not" && !postOrNot.isSafe)
                        ? "text-primary-500"
                        : "text-destructive",
                    )}
                  >
                    {feedback}
                  </p>

                  {((selected === "post" && postOrNot.isSafe) ||
                    (selected === "not" && !postOrNot.isSafe)) && (
                    <Button
                      className="font-monocraft ml-auto"
                      onClick={complete}
                      disabled={isPending}
                    >
                      Finalizar
                      {isPending && <Loader2Icon className="animate-spin" />}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
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
