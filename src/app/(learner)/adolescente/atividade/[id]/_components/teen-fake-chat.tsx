"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useActivity } from "@/hooks/use-activity";
import { cn } from "@/lib/utils";
import { TFakeChatContent } from "@/utils/activity-types";
import { Prisma } from "@prisma/client";
import { ChevronsRight, Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type TeenFakeChatProps = {
  activity: Prisma.ActivityGetPayload<{
    include: { activityProgress: true };
  }>;
  primaryColor: string;
  fakeChat: TFakeChatContent;
  userId: string;
};

export function TeenFakeChat({
  activity,
  primaryColor,
  fakeChat,
  userId,
}: TeenFakeChatProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { isPending, started, completed, xpEarned, start, complete } =
    useActivity(userId, activity.id);

  const isLastMessage = currentIndex + 1 >= fakeChat.messages.length;
  const currentMessage = fakeChat.messages[currentIndex];

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
      complete();
    }
  }

  return (
    <div className="grid min-h-screen w-full place-items-center p-4">
      <Image
        src="/images/teen-fake-chat-background.png"
        alt="Fake Chat"
        fill
        className="no-blur fixed top-0 left-0 -z-10 object-cover blur-sm brightness-90"
      />

      <div className="pointer-events-none absolute top-0 left-0 -z-10 h-full w-full bg-[radial-gradient(circle,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,0)_60%)]" />

      {!started && !completed && (
        <div className="w-full max-w-2xl space-y-12 px-4 text-center">
          <div className="relative">
            <h1
              className="text-5xl font-black uppercase opacity-80 md:text-8xl"
              style={{ color: primaryColor }}
            >
              Diálogo
            </h1>
            <span className="absolute top-1/2 left-1/2 -translate-1/2 font-serif text-3xl uppercase [text-shadow:0px_0px_24px_rgb(0,0,0)] md:text-5xl">
              Fake
            </span>
          </div>
          <div>
            <p
              className="text-xl uppercase md:text-2xl"
              style={{ color: primaryColor }}
            >
              Saiba o que nunca deve compartilhar
            </p>
            <p className="text-muted-foreground md:text-md text-sm">
              Nesse jogo, você simula uma conversa online. Ele ensina a
              reconhecer pedidos suspeitos e reforça a importância de nunca
              compartilhar dados como endereço, CPF ou informações pessoais que
              possam te colocar em risco.
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
        <Card className="w-full max-w-2xl gap-4 py-6">
          <CardHeader className="flex flex-row items-center gap-4">
            <Image
              src="/images/profile-picture.png"
              alt="Usuário desconhecido"
              width={40}
              height={40}
              className="rounded-full"
            />
            <CardTitle className="text-xl sm:text-2xl">
              Usuário desconhecido
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col gap-6 px-6">
            <div
              className="relative mr-auto flex max-w-sm items-center gap-2 rounded-lg rounded-bl-none p-4 leading-none text-black"
              style={{ backgroundColor: primaryColor + "22" }}
            >
              <p className="text-lg leading-6" style={{ color: primaryColor }}>
                {currentMessage.characterMessage}
              </p>
              <div
                className="absolute right-full bottom-0 w-0 translate-x-2 translate-y-2 rotate-45 border-8 border-transparent"
                style={{ borderLeftColor: primaryColor + "22" }}
              />
            </div>

            <div className="relative ml-auto flex max-h-20 w-full max-w-40 items-center gap-2 rounded-lg rounded-br-none bg-neutral-100 p-4 leading-none text-black">
              <Image
                src="/images/loader.svg"
                alt="..."
                width={80}
                height={80}
                className="mx-auto"
              />
              <div className="absolute bottom-0 left-full w-0 -translate-x-2 translate-y-2 rotate-135 border-8 border-transparent border-l-neutral-100" />
            </div>

            <Separator />

            <div className="space-y-4">
              <p className="text-center text-lg font-bold">
                Qual a melhor resposta?
              </p>

              <div className="flex flex-col gap-3 *:flex-1">
                {currentMessage.options.map((opt, i) => (
                  <Button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={
                      selected !== null &&
                      currentMessage.options[selected]?.isSafe
                    }
                    className={cn(
                      "text-md h-auto max-h-none whitespace-break-spaces",
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
                    className={`text-lg ${
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
                        size="lg"
                        className="text-xl font-bold uppercase"
                        onClick={handleNext}
                        disabled={isPending}
                      >
                        {isLastMessage ? "Finalizar" : "Próximo"}
                        {isPending && (
                          <Loader2Icon className="size-6 animate-spin" />
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
        <div className="flex h-full flex-col items-center justify-center space-y-4 px-4 text-center">
          <h2 className="text-4xl font-extrabold md:text-8xl">Parabéns!</h2>
          <p className="text-xl">
            Você concluiu a simulação e ganhou{" "}
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
