"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TFakeChatContent } from "@/utils/activity-types";
import { activityType } from "@/utils/enums";
import { Prisma } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

type ChildFakeChatProps = {
  activity: Prisma.ActivityGetPayload<{
    include: { activityProgress: true };
  }>;
  fakeChat: TFakeChatContent;
  userId: string;
};

export function ChildFakeChat({
  activity,
  fakeChat,
  userId,
}: ChildFakeChatProps) {
  const [isPending, startTransition] = useTransition();
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  const isLastMessage = currentIndex + 1 >= fakeChat.messages.length;
  const currentMessage = fakeChat.messages[currentIndex];

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

  function handleAnswer(i: number) {
    setSelected(i);
    setFeedback(currentMessage.options[i].feedback);

    // se a opção for incorreta, libera para tentar de novo
    if (!currentMessage.options[i].isSafe) {
      setTimeout(() => {
        setSelected(null);
      }, 1200); // libera em 1.2s (pra mostrar o feedback antes)
    }
  }

  function handleNext() {
    if (!isLastMessage) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setFeedback(null);
    } else {
      handleFinish();
    }
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
        src="/images/pixel-fake-chat-background.png"
        alt="Fake Chat"
        fill
        className="no-blur fixed top-0 left-0 -z-10 object-cover brightness-90"
      />
      <div className="flex h-full w-full flex-col items-center gap-10 px-4 py-10 sm:gap-20 md:flex-row md:justify-center">
        <Image
          src="/images/pixel-chat.png"
          alt="Chat"
          width={400}
          height={400}
          className="no-blur size-50 md:size-80"
        />

        {!started && !completed && (
          <div className="max-w-2xl text-center">
            <h1 className="font-upheaval text-4xl md:text-7xl">
              {activityType[activity.type]}
            </h1>
            <p className="font-monocraft text-xl md:text-3xl">
              {fakeChat.title}
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
          <Card className="w-full max-w-2xl gap-4 py-4">
            <CardHeader className="flex flex-row items-center gap-4">
              <Image
                src="/images/profile-picture.png"
                alt="Usuário desconhecido"
                width={40}
                height={40}
                className="rounded-full"
              />
              <CardTitle className="font-upheaval text-2xl font-normal">
                Usuário desconhecido
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col gap-6 p-6 pt-2">
              <div className="relative mr-auto flex max-w-sm items-center gap-2 rounded-lg rounded-bl-none bg-neutral-100 p-4 leading-none text-black">
                <p className="font-monocraft text-lg">
                  {currentMessage.characterMessage}
                </p>
                <div className="absolute right-full bottom-0 w-0 translate-x-2 translate-y-2 rotate-45 border-8 border-transparent border-l-neutral-100" />
              </div>

              <Separator />

              <div className="space-y-4">
                <p className="font-monocraft text-center">
                  Escolha sua resposta
                </p>

                <div className="flex flex-wrap gap-3 *:flex-1">
                  {currentMessage.options.map((opt, i) => (
                    <Button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={
                        selected !== null &&
                        currentMessage.options[selected]?.isSafe
                      }
                      className={cn(
                        "font-monocraft justify-center",
                        selected === i
                          ? opt.isSafe
                            ? "bg-primary-600!"
                            : "bg-destructive/60!"
                          : "",
                      )}
                      variant="outline"
                    >
                      {opt.text}
                    </Button>
                  ))}
                </div>
              </div>

              {feedback && (
                <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                  <div>
                    <p
                      className={`font-monocraft text-lg ${
                        currentMessage.options[selected!]?.isSafe
                          ? "text-primary-500"
                          : "text-destructive"
                      }`}
                    >
                      {feedback}
                    </p>
                  </div>

                  <div className="ml-auto">
                    {currentMessage.options[selected!]?.isSafe && (
                      <div className="ml-auto">
                        <Button
                          className="font-monocraft"
                          onClick={handleNext}
                          disabled={isPending}
                        >
                          {isLastMessage ? "Finalizar" : "Próximo"}
                          {isPending && (
                            <Loader2Icon className="animate-spin" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {completed && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h2 className="font-upheaval text-4xl md:text-6xl">Parabéns!</h2>
            <p className="font-monocraft text-xl leading-none">
              Você concluiu a simulação e ganhou{" "}
              <span className="font-upheaval text-4xl">{xpEarned} XP</span>
            </p>
<<<<<<<< HEAD:src/app/(learner)/crianca/missoes/[id]/_components/child-fake-chat.tsx
            <Link href="/crianca/missoes">
========
            <Link href="/aprendiz/crianca/missoes">
>>>>>>>> 774d0193b4bae464265fff6bb89c0711d3c7c445:src/app/(learner)/aprendiz/crianca/missoes/[id]/_components/child-fake-chat.tsx
              <Button className="font-monocraft mt-4">Voltar às missões</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
