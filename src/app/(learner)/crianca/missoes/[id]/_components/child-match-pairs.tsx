"use client";

import { Button } from "@/components/ui/button";
import { useActivity } from "@/hooks/use-activity";
import { cn } from "@/lib/utils";
import { TMatchPairsContent } from "@/utils/activity-types";
import { Prisma } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ChildMatchPairsProps = {
  activity: Prisma.ActivityGetPayload<{
    include: { activityProgress: true };
  }>;
  matchPairs: TMatchPairsContent;
  userId: string;
};

type Card = {
  id: string;
  content: string;
  matched: boolean;
};

export function ChildMatchPairs({
  activity,
  matchPairs,
  userId,
}: ChildMatchPairsProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(matchPairs.timeLimit);

  const { isPending, started, completed, xpEarned, start, complete } =
    useActivity(userId, activity.id);

  // Monta cartas (term + definition) e embaralha
  function createCardsFromConcepts(): Card[] {
    return matchPairs.concepts.flatMap((c) => [
      { id: `${c.term}-term`, content: c.term, matched: false },
      { id: `${c.term}-def`, content: c.definition, matched: false },
    ]);
  }

  function shuffleArray<T>(array: T[]) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  // inicializa cartas quando receber matchPairs
  useEffect(() => {
    const initial = shuffleArray(createCardsFromConcepts());
    setCards(initial);
    setTimeLeft(matchPairs.timeLimit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchPairs]);

  // Timer
  useEffect(() => {
    if (!started || completed) return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, started, completed]);

  // flip da carta
  function handleFlip(id: string) {
    if (!started || completed) return;
    if (flipped.includes(id)) return;
    if (cards.find((c) => c.id === id)?.matched) return;
    if (flipped.length === 2) return;
    setFlipped((prev) => [...prev, id]);
  }

  // lógica quando duas cartas viradas
  useEffect(() => {
    if (flipped.length !== 2) return;

    const [firstId, secondId] = flipped;
    const first = cards.find((c) => c.id === firstId);
    const second = cards.find((c) => c.id === secondId);

    // espera o flip terminar visualmente
    const timeout = setTimeout(() => {
      if (!first || !second) {
        setFlipped([]);
        return;
      }

      const samePair =
        first.id.split("-")[0] === second.id.split("-")[0] &&
        first.id !== second.id;

      if (samePair) {
        // marca como matched
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId ? { ...c, matched: true } : c,
          ),
        );
      }

      // limpa as cartas viradas para permitir novas jogadas
      setFlipped([]);
      setAttempts((a) => a + 1);
    }, 600);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped]);

  // checa vitória / limite de tentativas
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      complete();
    } else if (
      attempts > 0 &&
      attempts >= matchPairs.maxAttempts &&
      !completed
    ) {
      // quando estoura as tentativas, registra tentativa e reinicia
      handleMaxAttemptsReached();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, attempts]);

  function resetActivity() {
    start();
    setFlipped([]);
    setAttempts(0);
    setCards(shuffleArray(createCardsFromConcepts()));
    setTimeLeft(matchPairs.timeLimit);
  }

  function handleTimeout() {
    toast.error("Tempo esgotado! Tente novamente");
    resetActivity();
  }

  function handleMaxAttemptsReached() {
    toast.error("Máximo de tentativas atingido! Tente novamente");
    resetActivity();
  }

  return (
    <div className="relative h-full w-full">
      <Image
        src="/images/pixel-match-pairs-background.png"
        alt="Match Pairs"
        fill
        className="fixed top-0 left-0 -z-10 object-cover brightness-90"
      />

      <div className="flex h-full w-full flex-col items-center gap-10 px-4 py-8 sm:gap-12 md:flex-row md:justify-center">
        {(!started || completed) && (
          <Image
            src="/images/pixel-match-pairs.png"
            alt="Pares"
            width={360}
            height={360}
            className="no-blur size-50 md:size-80"
          />
        )}

        {!started && !completed && (
          <div className="flex flex-col items-center text-center">
            <h1 className="font-upheaval text-4xl md:text-6xl">Pares Iguais</h1>
            <p className="font-monocraft text-lg md:text-2xl">
              {matchPairs.title}
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
          <div className="flex w-full max-w-4xl flex-col items-center gap-12">
            <div className="font-monocraft flex flex-col items-center gap-6 text-lg md:flex-row">
              <p>
                Tempo restante: <strong>{timeLeft}s</strong>
              </p>
              <p>
                Tentativas: {attempts}/{matchPairs.maxAttempts}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8">
              {cards.map((card) => {
                const isFlipped = flipped.includes(card.id) || card.matched;

                return (
                  <div
                    key={card.id}
                    onClick={() => handleFlip(card.id)}
                    className={cn(
                      "h-30 w-30 cursor-pointer select-none perspective-distant sm:h-40 sm:w-40",
                      card.matched && "pointer-events-none opacity-60",
                    )}
                  >
                    <div
                      className={cn(
                        "relative h-full w-full transition duration-500 transform-3d",
                        isFlipped ? "rotate-y-180" : "rotate-y-0",
                      )}
                    >
                      <div className="absolute inset-0 overflow-hidden rounded-md backface-hidden">
                        <div className="relative h-full w-full">
                          <Image
                            src="/images/pixel-match-pairs-card-back.png"
                            alt="card back"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>

                      <div className="absolute inset-0 rotate-y-180 overflow-hidden rounded-md backface-hidden">
                        <div className="relative h-full w-full">
                          <Image
                            src="/images/pixel-match-pairs-card-front.png"
                            alt="card front"
                            fill
                            className="object-contain"
                          />
                          <div className="absolute inset-0 flex items-center justify-center p-2">
                            <div className="font-monocraft px-4 text-center text-xs leading-none text-black sm:text-sm">
                              {card.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {completed && (
          <div className="flex flex-col items-center text-center">
            <h2 className="font-upheaval text-6xl md:text-6xl">Parabéns!</h2>
            <p className="font-monocraft text-xl leading-none">
              Você completou a atividade e ganhou{" "}
              <span className="font-upheaval text-4xl">{xpEarned} XP</span>
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
