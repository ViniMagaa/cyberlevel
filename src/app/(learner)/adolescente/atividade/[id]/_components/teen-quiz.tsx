"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useActivity } from "@/hooks/use-activity";
import { cn } from "@/lib/utils";
import { TQuizContent } from "@/utils/activity-types";
import { Prisma } from "@prisma/client";
import { Check, ChevronsRight, Loader2Icon, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type TeenQuizProps = {
  activity: Prisma.ActivityGetPayload<{
    include: {
      activityProgress: true;
    };
  }>;
  primaryColor: string;
  quiz: TQuizContent;
  userId: string;
};

export function TeenQuiz({
  activity,
  primaryColor,
  quiz,
  userId,
}: TeenQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [points, setPoints] = useState(0);

  const { isPending, started, completed, xpEarned, start, complete } =
    useActivity(userId, activity.id);

  const isLastQuestion = currentIndex + 1 >= quiz.questions.length;
  const currentQuestion = quiz.questions[currentIndex];

  function handleAnswer() {
    if (selected === null) return;

    const isCorrectQuestion = selected === currentQuestion.correctIndex;

    setIsCorrect(isCorrectQuestion);
    setPoints((prev) => (isCorrectQuestion ? prev + 1 : prev));
  }

  function handleNext() {
    if (!isLastQuestion) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setIsCorrect(null);
    } else {
      complete();
    }
  }

  return (
    <div className="relative grid min-h-screen w-full place-items-center">
      <div
        className="absolute top-0 -z-10 h-[1px] w-full overflow-hidden"
        style={{
          backgroundColor: primaryColor,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-20 rounded-[inherit] opacity-20"
        style={{
          background: `linear-gradient(to bottom, ${primaryColor} 5%, ${primaryColor}55, transparent 40%)`,
        }}
      />

      {!started && !completed && (
        <div className="w-full max-w-2xl space-y-12 px-4 text-center">
          <h1 className="text-5xl font-black uppercase md:text-8xl">
            {quiz.title}
          </h1>
          <div>
            <p
              className="text-xl uppercase md:text-2xl"
              style={{ color: primaryColor }}
            >
              Teste o quanto você aprendeu
            </p>
            <p className="text-muted-foreground md:text-md text-sm">
              Teste seus conhecimentos sobre segurança digital neste quiz rápido
              e divertido! Descubra o quanto você sabe enquanto aprende de forma
              leve e interativa.
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
        <div className="flex w-full flex-col items-center gap-12">
          <h1 className="px-4 pt-12 text-center text-4xl font-black uppercase md:text-6xl">
            {quiz.title}
          </h1>

          <div className="w-full px-4">
            <Card className="mx-auto w-full max-w-2xl gap-4 rounded-4xl p-4">
              <CardHeader className="flex flex-wrap items-center justify-between gap-2 p-0">
                <span
                  style={{
                    backgroundColor: primaryColor + "55",
                    borderColor: primaryColor + "55",
                  }}
                  className="rounded-full border px-3 py-1 text-base font-bold text-white sm:text-xl"
                >
                  Pergunta {currentIndex + 1}/{quiz.questions.length}
                </span>
                <span
                  style={{
                    backgroundColor: primaryColor + "55",
                    borderColor: primaryColor + "55",
                  }}
                  className="rounded-full border px-3 py-1 text-base font-bold text-white sm:text-xl"
                >
                  Acertos: {points}
                </span>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 p-0">
                <p className="text-lg font-semibold">{currentQuestion.text}</p>

                <RadioGroup
                  value={selected?.toString() || ""}
                  className="gap-2"
                  disabled={isCorrect !== null}
                  onValueChange={(val) => {
                    setIsCorrect(null);
                    setSelected(Number(val));
                  }}
                >
                  {currentQuestion.options.map((opt, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center space-x-2 rounded-full px-2 py-2",
                        selected === i &&
                          isCorrect === null &&
                          "bg-neutral-800",
                        selected !== null &&
                          isCorrect !== null &&
                          (selected === i ||
                            i === currentQuestion.correctIndex) &&
                          "bg-primary-900 outline-primary-700 outline",
                        selected === i &&
                          isCorrect === false &&
                          "bg-destructive/30 outline-destructive/50 outline",
                      )}
                    >
                      <RadioGroupItem value={i.toString()} id={`option-${i}`} />
                      <Label htmlFor={`option-${i}`} className="flex-1">
                        {opt.text}
                      </Label>

                      {isCorrect !== null &&
                        i === currentQuestion.correctIndex && (
                          <Check size={16} className="text-primary-500" />
                        )}
                      {isCorrect === false && selected === i && (
                        <X size={16} className="text-destructive" />
                      )}
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                  <div>
                    {isCorrect !== null && (
                      <p className="text-primary-500">
                        {currentQuestion.feedback}
                      </p>
                    )}
                  </div>

                  <div className="ml-auto">
                    {isCorrect === null && (
                      <Button
                        size="lg"
                        className="text-xl font-bold uppercase"
                        onClick={handleAnswer}
                        disabled={selected === null || isPending}
                      >
                        Confirmar{" "}
                        {isPending && (
                          <Loader2Icon className="size-6 animate-spin" />
                        )}
                      </Button>
                    )}

                    {isCorrect !== null && (
                      <Button
                        size="lg"
                        className="text-xl font-bold uppercase"
                        disabled={isPending}
                        onClick={handleNext}
                      >
                        {isLastQuestion ? "Finalizar" : "Próximo"}
                        {isPending && (
                          <Loader2Icon className="size-6 animate-spin" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {completed && (
        <div className="flex h-full flex-col items-center justify-center space-y-4 px-4 text-center">
          <h2 className="text-4xl font-extrabold md:text-8xl">Parabéns!</h2>
          <p className="text-xl">
            Você concluiu o quiz e ganhou{" "}
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
