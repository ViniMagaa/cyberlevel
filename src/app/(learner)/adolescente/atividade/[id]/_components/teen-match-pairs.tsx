"use client";

import Plasma from "@/components/plasma";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/hooks/use-activity";
import { cn } from "@/lib/utils";
import { TMatchPairsContent } from "@/utils/activity-types";
import { activityType } from "@/utils/enums";
import { Prisma } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronsRight, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type TeenMatchPairsProps = {
  activity: Prisma.ActivityGetPayload<{
    include: { activityProgress: true };
  }>;
  matchPairs: TMatchPairsContent;
  userId: string;
  primaryColor: string;
};

type Card = {
  id: string;
  content: string;
  matched: boolean;
  type: "term" | "definition";
};

export function TeenMatchPairs({
  activity,
  matchPairs,
  userId,
  primaryColor,
}: TeenMatchPairsProps) {
  const [leftCards, setLeftCards] = useState<Card[]>([]);
  const [rightCards, setRightCards] = useState<Card[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(matchPairs.timeLimit);
  const [flash, setFlash] = useState<"success" | "error" | null>(null);

  const { isPending, started, completed, xpEarned, start, complete } =
    useActivity(userId, activity.id);

  // Função de embaralhar
  function shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  // Inicializa cartas
  useEffect(() => {
    const left = matchPairs.concepts.map((c) => ({
      id: `${c.term}-term`,
      content: c.term,
      matched: false,
      type: "term" as const,
    }));
    const right = matchPairs.concepts.map((c) => ({
      id: `${c.term}-def`,
      content: c.definition,
      matched: false,
      type: "definition" as const,
    }));

    setLeftCards(shuffle(left));
    setRightCards(shuffle(right));
    setTimeLeft(matchPairs.timeLimit);
  }, [matchPairs]);

  // Timer
  useEffect(() => {
    if (!started || completed) return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, started, completed]);

  function handleSelect(card: Card) {
    if (!started || completed) return;
    if (card.matched) return;

    if (card.type === "term") {
      setSelectedLeft(card.id === selectedLeft ? null : card.id);
    } else {
      setSelectedRight(card.id === selectedRight ? null : card.id);
    }
  }

  // Comparação
  useEffect(() => {
    if (selectedLeft && selectedRight) {
      const left = leftCards.find((c) => c.id === selectedLeft);
      const right = rightCards.find((c) => c.id === selectedRight);
      const isMatch =
        left && right && left.id.split("-")[0] === right.id.split("-")[0];

      if (isMatch) {
        setFlash("success");
        setLeftCards((prev) =>
          prev.map((c) => (c.id === left!.id ? { ...c, matched: true } : c)),
        );
        setRightCards((prev) =>
          prev.map((c) => (c.id === right!.id ? { ...c, matched: true } : c)),
        );
      } else {
        setFlash("error");
      }

      setAttempts((a) => a + 1);
      setTimeout(() => {
        setFlash(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 700);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLeft, selectedRight]);

  // Vitória ou limite
  useEffect(() => {
    const allMatched =
      leftCards.length > 0 &&
      leftCards.every((c) => c.matched) &&
      rightCards.every((c) => c.matched);

    if (allMatched) {
      complete();
    } else if (attempts >= matchPairs.maxAttempts && !completed && started) {
      handleMaxAttemptsReached();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftCards, rightCards, attempts]);

  function resetActivity() {
    start();
    setLeftCards((prev) =>
      shuffle(prev.map((c) => ({ ...c, matched: false }))),
    );
    setRightCards((prev) =>
      shuffle(prev.map((c) => ({ ...c, matched: false }))),
    );
    setSelectedLeft(null);
    setSelectedRight(null);
    setAttempts(0);
    setTimeLeft(matchPairs.timeLimit);
  }

  function handleTimeout() {
    toast.error("Tempo esgotado! Tente novamente.");
    resetActivity();
  }

  function handleMaxAttemptsReached() {
    toast.error("Máximo de tentativas atingido! Tente novamente.");
    resetActivity();
  }

  return (
    <div className="relative grid min-h-screen w-full place-items-center py-12">
      <div className="fixed inset-0 -z-10">
        <Plasma
          color={primaryColor}
          speed={0.6}
          direction="forward"
          scale={0.8}
          opacity={0.4}
          mouseInteractive={true}
        />
      </div>

      {/* Efeito de flash ao acertar/errar */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
              "fixed inset-0 z-10",
              flash === "success" ? "bg-primary-500" : "bg-destructive",
            )}
          />
        )}
      </AnimatePresence>

      {!started && !completed && (
        <div className="w-full space-y-12 px-4 text-center">
          <h1 className="text-5xl font-black uppercase md:text-8xl">
            {activityType[activity.type]}
          </h1>
          <div className="mx-auto max-w-md">
            <p
              className="text-xl uppercase md:text-2xl"
              style={{ color: primaryColor }}
            >
              Combine os pares corretos
            </p>
            <p className="text-muted-foreground md:text-md text-sm">
              Relacione termos e conceitos de cibersegurança e prove que você
              entende como o mundo digital funciona.
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
        <div className="flex w-full max-w-3xl flex-col items-center gap-8">
          <h1 className="text-5xl font-black uppercase md:text-8xl">
            {activityType[activity.type]}
          </h1>

          <div className="flex w-full items-center justify-between gap-4 text-lg">
            <span
              style={{
                backgroundColor: primaryColor + "55",
                borderColor: primaryColor + "55",
              }}
              className="rounded-full border px-3 py-1 text-base font-bold text-white sm:text-xl"
            >
              Tempo restante: <strong>{timeLeft}s</strong>
            </span>
            <span
              style={{
                backgroundColor: primaryColor + "55",
                borderColor: primaryColor + "55",
              }}
              className="rounded-full border px-3 py-1 text-base font-bold text-white sm:text-xl"
            >
              Tentativas: {attempts}/{matchPairs.maxAttempts}
            </span>
          </div>

          <div className="grid w-full grid-cols-2 gap-6">
            {/* Coluna esquerda */}
            <div className="grid gap-6">
              {leftCards.map((card) => (
                <motion.button
                  key={card.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(card)}
                  className={cn(
                    "rounded-full border px-4 py-3 text-center transition",
                    card.matched && "bg-gray-300 opacity-50",
                  )}
                  style={{
                    color: selectedLeft === card.id ? "white" : "black",
                    borderColor: card.matched
                      ? "transparent"
                      : selectedLeft === card.id
                        ? primaryColor + "55"
                        : "#ccc",
                    backgroundColor:
                      selectedLeft === card.id ? primaryColor + "55" : "white",
                  }}
                >
                  {card.content}
                </motion.button>
              ))}
            </div>

            {/* Coluna direita */}
            <div className="grid gap-6">
              {rightCards.map((card) => (
                <motion.button
                  key={card.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(card)}
                  className={cn(
                    "rounded-full border px-4 py-3 text-center transition",
                    card.matched && "bg-gray-300 opacity-50",
                  )}
                  style={{
                    color: selectedRight === card.id ? "white" : "black",
                    borderColor: card.matched
                      ? "transparent"
                      : selectedRight === card.id
                        ? primaryColor + "55"
                        : "#ccc",
                    backgroundColor:
                      selectedRight === card.id ? primaryColor + "55" : "white",
                  }}
                >
                  {card.content}
                </motion.button>
              ))}
            </div>
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
