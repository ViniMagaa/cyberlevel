"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useActivity } from "@/hooks/use-activity";
import { TQuizContent } from "@/utils/activity-types";
import { Prisma } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type ChildQuizProps = {
  activity: Prisma.ActivityGetPayload<{
    include: {
      activityProgress: true;
    };
  }>;
  quiz: TQuizContent;
  userId: string;
};

export function ChildQuiz({ activity, quiz, userId }: ChildQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { isPending, started, completed, xpEarned, start, complete } =
    useActivity(userId, activity.id);

  const isLastQuestion = currentIndex + 1 >= quiz.questions.length;
  const currentQuestion = quiz.questions[currentIndex];

  function handleAnswer() {
    if (selected === null) return;

    setIsCorrect(selected === currentQuestion.correctIndex);
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
    <div className="h-full w-full">
      <Image
        src="/images/pixel-quiz-background.png"
        alt="Quiz"
        fill
        className="no-blur fixed -z-10 object-cover brightness-90"
      />
      <div className="flex h-full w-full flex-col items-center gap-10 px-4 py-15 sm:gap-20 md:flex-row md:justify-center md:pt-0">
        <Image
          src="/images/pixel-light.png"
          alt="Lâmpada"
          width={400}
          height={381}
          className="no-blur size-50 md:size-80"
        />
        {!started && !completed && (
          <div className="max-w-2xl text-center">
            <h1 className="font-upheaval text-4xl md:text-7xl">{quiz.title}</h1>
            <p className="font-monocraft text-xl md:text-3xl">
              Teste seu conhecimento
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
          <Card className="w-full max-w-2xl gap-2">
            <CardHeader>
              <CardTitle className="font-upheaval text-2xl font-normal">
                Pergunta {currentIndex + 1} de {quiz.questions.length}
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col gap-6">
              <p className="font-monocraft text-lg">{currentQuestion.text}</p>

              <RadioGroup
                value={selected?.toString() || ""}
                disabled={!!isCorrect}
                onValueChange={(val) => {
                  setIsCorrect(null);
                  setSelected(Number(val));
                }}
              >
                {currentQuestion.options.map((opt, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <RadioGroupItem value={i.toString()} id={`option-${i}`} />
                    <Label htmlFor={`option-${i}`} className="text-lg">
                      {opt.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                <div>
                  {isCorrect === true && (
                    <p className="font-monocraft text-primary-500 text-lg">
                      {currentQuestion.feedback}
                    </p>
                  )}

                  {isCorrect === false && (
                    <p className="font-monocraft text-destructive text-lg">
                      Tente novamente!
                    </p>
                  )}
                </div>

                <div className="ml-auto">
                  {!isCorrect && (
                    <Button
                      className="font-monocraft ml-auto"
                      onClick={handleAnswer}
                      disabled={selected === null || isPending}
                    >
                      Confirmar{" "}
                      {isPending && <Loader2Icon className="animate-spin" />}
                    </Button>
                  )}

                  {isCorrect && (
                    <Button
                      className="font-monocraft ml-auto"
                      disabled={isPending}
                      onClick={handleNext}
                    >
                      {isLastQuestion ? "Finalizar" : "Próximo"}
                      {isPending && <Loader2Icon className="animate-spin" />}
                    </Button>
                  )}
                </div>
              </div>
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
