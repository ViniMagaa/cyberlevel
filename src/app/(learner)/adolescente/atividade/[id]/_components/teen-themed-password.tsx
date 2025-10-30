"use client";

import LetterGlitch from "@/components/letter-glitch";
import { RuleMessage } from "@/components/rule-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActivity } from "@/hooks/use-activity";
import { cn } from "@/lib/utils";
import { TThemedPasswordContent } from "@/utils/activity-types";
import { activityType } from "@/utils/enums";
import { Prisma } from "@prisma/client";
import { ArrowRight, ChevronsRight, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type TeenThemedPasswordProps = {
  activity: Prisma.ActivityGetPayload<{
    include: {
      activityProgress: true;
    };
  }>;
  primaryColor: string;
  themedPassword: TThemedPasswordContent;
  userId: string;
};

export function TeenThemedPassword({
  activity,
  primaryColor,
  themedPassword,
  userId,
}: TeenThemedPasswordProps) {
  const [password, setPassword] = useState("");
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);

  const { isPending, started, completed, xpEarned, start, complete } =
    useActivity(userId, activity.id);

  function validateRule(rule: TThemedPasswordContent["rules"][0]) {
    switch (rule.type) {
      case "MIN_LENGTH":
        return password.length >= Number(rule.value);
      case "MAX_LENGTH":
        return password.length <= Number(rule.value);
      case "UPPERCASE":
        return /[A-Z]/.test(password);
      case "LOWERCASE":
        return /[a-z]/.test(password);
      case "NUMBER":
        return /\d/.test(password);
      case "SPECIAL_CHAR":
        return /[^A-Za-z0-9]/.test(password);
      case "INCLUDE_WORD":
        return password
          .toLocaleUpperCase()
          .includes(rule.value?.toLocaleUpperCase() || "");
      case "EXCLUDE_WORD":
        return !password
          .toLocaleUpperCase()
          .includes(rule.value?.toLocaleUpperCase() || "");
      default:
        return false;
    }
  }

  function handleCheck() {
    const currentRule = themedPassword.rules[currentRuleIndex];
    if (!validateRule(currentRule)) return;

    if (currentRuleIndex + 1 < themedPassword.rules.length) {
      setCurrentRuleIndex((prev) => prev + 1);
      return;
    }

    if (!themedPassword.rules.every((rule) => validateRule(rule))) {
      toast.error("A senha não atende a todas as regras!");
      return;
    }

    complete();
  }

  return (
    <div className="grid min-h-screen w-full place-items-center">
      <div className="fixed inset-0 -z-10 opacity-40">
        <LetterGlitch
          glitchColors={[
            primaryColor,
            primaryColor + "bb",
            primaryColor + "55",
          ]}
          glitchSpeed={100}
          centerVignette={true}
          outerVignette={true}
          smooth={true}
        />
      </div>

      {!started && !completed && (
        <div className="w-full max-w-lg space-y-12 px-4 text-center">
          <h1 className="text-5xl font-black uppercase md:text-8xl">
            {activityType[activity.type]}
          </h1>
          <div className="mx-auto max-w-sm">
            <p
              className="text-xl uppercase md:text-2xl"
              style={{ color: primaryColor }}
            >
              Crie a senha perfeita
            </p>
            <p className="text-muted-foreground md:text-md text-sm">
              Use dicas e regras de segurança para montar combinações fortes e
              aprenda a proteger suas contas.
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
        <div className="flex w-full max-w-md flex-col gap-6 px-4 py-12 text-center">
          <h1 className="text-5xl font-black">{activity.title}</h1>
          <p className="text-xl font-semibold">{themedPassword.mission}</p>
          <div className="relative">
            <Input
              type="text"
              className="h-auto w-full rounded-full bg-neutral-950! py-2 pr-12 pl-4 text-2xl!"
              value={password}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="absolute top-1/2 right-2 -translate-y-1/2"
              size="icon"
              onClick={handleCheck}
              disabled={isPending}
            >
              {!isPending ? (
                <ArrowRight className="size-6" />
              ) : (
                <Loader2Icon className="size-6 animate-spin" />
              )}
            </Button>
          </div>

          <div className="flex flex-col-reverse gap-4">
            {themedPassword.rules.map((rule, index) => (
              <div
                key={index}
                className={cn(
                  "translate-y-2 opacity-0 transition-all duration-500",
                  currentRuleIndex >= index && "static translate-0 opacity-100",
                  index > currentRuleIndex && "absolute",
                )}
              >
                <RuleMessage rule={rule} valid={validateRule(rule)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {completed && (
        <div className="flex h-full flex-col items-center justify-center space-y-4 px-4 text-center">
          <h2 className="text-4xl font-extrabold md:text-8xl">Parabéns!</h2>
          <p className="text-xl">
            Você criou sua senha e ganhou{" "}
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
