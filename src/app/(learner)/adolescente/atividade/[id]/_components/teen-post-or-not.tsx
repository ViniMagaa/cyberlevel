"use client";

import Silk from "@/components/silk";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActivity } from "@/hooks/use-activity";
import { cn } from "@/lib/utils";
import { TPostOrNotContent } from "@/utils/activity-types";
import { activityType } from "@/utils/enums";
import { Prisma } from "@prisma/client";
import { ChevronsRight, Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type TeenPostOrNotProps = {
  activity: Prisma.ActivityGetPayload<{
    include: { activityProgress: true };
  }>;
  primaryColor: string;
  postOrNot: TPostOrNotContent;
  userId: string;
};

export function TeenPostOrNot({
  activity,
  primaryColor,
  postOrNot,
  userId,
}: TeenPostOrNotProps) {
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
    <div className="relative grid min-h-screen w-full place-items-center py-12">
      <div className="fixed inset-0 -z-10 opacity-40">
        <Silk
          speed={3}
          scale={1}
          color={primaryColor}
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      {!started && !completed && (
        <div className="w-full space-y-12 px-4 text-center">
          <h1 className="mx-auto max-w-2xl text-5xl font-black uppercase md:text-8xl">
            {activityType[activity.type]}
          </h1>
          <div className="mx-auto max-w-sm">
            <p
              className="text-xl uppercase md:text-2xl"
              style={{ color: primaryColor }}
            >
              Avalie a situação e decida
            </p>
            <p className="text-muted-foreground md:text-md text-sm">
              É seguro postar isso? Aprenda a pensar antes de publicar e evite
              expor informações pessoais.
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
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
          <Card className="mx-auto w-full max-w-lg sm:max-w-none">
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold sm:text-4xl">
                {postOrNot.title}
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="flex flex-col items-start gap-6 md:flex-row">
            <Card className="mx-auto w-full max-w-lg">
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
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col gap-6">
                <p className="text-lg">{postOrNot.description}</p>

                <div className="flex flex-wrap gap-3 *:flex-1">
                  <Button
                    onClick={() => handleAnswer("post")}
                    disabled={
                      selected !== null && postOrNot.isSafe
                        ? selected === "post"
                        : selected === "not"
                    }
                    variant="outline"
                    className={
                      selected === "post"
                        ? postOrNot.isSafe
                          ? "bg-primary-600!"
                          : "bg-destructive/60!"
                        : ""
                    }
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
                      "",
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
                  <div className="flex flex-col items-center justify-between gap-2">
                    <p
                      className={cn(
                        "text-lg",
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
                        size="lg"
                        className="ml-auto text-xl font-bold uppercase"
                        onClick={complete}
                        disabled={isPending}
                      >
                        Finalizar
                        {isPending && (
                          <Loader2Icon className="size-6 animate-spin" />
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {completed && (
        <div className="flex h-full flex-col items-center justify-center space-y-4 px-4 text-center">
          <h2 className="text-4xl font-extrabold md:text-8xl">Parabéns!</h2>
          <p className="text-xl">
            Você ganhou{" "}
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
