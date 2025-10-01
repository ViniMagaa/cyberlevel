"use client";

import { RuleMessage } from "@/components/rule-message";
import { Button } from "@/components/ui/button";
import { TThemedPasswordContent } from "@/utils/activity-types";
import { activityType } from "@/utils/enums";
import { Prisma } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

type ChildThemedPasswordProps = {
  activity: Prisma.ActivityGetPayload<{
    include: {
      activityProgress: true;
    };
  }>;
  themedPassword: TThemedPasswordContent;
  userId: string;
};

export function ChildThemedPassword({
  activity,
  themedPassword,
  userId,
}: ChildThemedPasswordProps) {
  const [isPending, startTransition] = useTransition();
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);

  const [password, setPassword] = useState("");
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);

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
        return password.includes(rule.value || "");
      case "EXCLUDE_WORD":
        return !password.includes(rule.value || "");
      default:
        return false;
    }
  }

  function handleCheck() {
    const currentRule = themedPassword.rules[currentRuleIndex];
    if (validateRule(currentRule)) {
      if (currentRuleIndex + 1 < themedPassword.rules.length) {
        setCurrentRuleIndex((prev) => prev + 1);
      } else {
        handleFinish();
      }
    }
  }

  function handleFinish() {
    toast.success(themedPassword.feedback);
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
        src="/images/pixel-themed-password-background.png"
        alt="Themed Password"
        fill
        className="no-blur fixed top-0 left-0 -z-10 object-cover brightness-90"
      />

      <div className="flex h-full w-full flex-col items-center gap-10 px-4 py-15 sm:gap-20 md:flex-row md:justify-center">
        <Image
          src="/images/pixel-padlock.png"
          alt="Cadeado"
          width={400}
          height={400}
          className="size-50 md:size-80"
        />

        {!started && !completed && (
          <div className="max-w-2xl text-center">
            <h1 className="font-upheaval text-4xl md:text-7xl">
              {activityType[activity.type]}
            </h1>
            <p className="font-monocraft text-xl md:text-3xl">
              {activity.title}
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
          <div className="flex w-full max-w-lg flex-col gap-6">
            <h1 className="font-upheaval text-5xl">{activity.title}</h1>
            <p className="font-monocraft text-xl">{themedPassword.mission}</p>
            <div className="relative mx-auto h-[64px] w-full">
              <Image
                src="/images/pixel-themed-password-input.png"
                alt="Input senha"
                fill
                className="pointer-events-none select-none"
              />
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-monocraft absolute inset-0 h-full w-full bg-transparent px-6 text-xl text-black outline-none"
              />
            </div>

            <div className="flex flex-col gap-4">
              {themedPassword.rules
                .slice(0, currentRuleIndex + 1)
                .map((rule, index) => {
                  const passed = validateRule(rule);

                  return (
                    <div
                      key={index}
                      className="font-monocraft relative flex h-[80px] flex-col gap-2 py-1 text-base text-black"
                    >
                      <Image
                        src={
                          passed
                            ? "/images/pixel-themed-password-right-card.png"
                            : "/images/pixel-themed-password-wrong-card.png"
                        }
                        alt="Regra"
                        fill
                        className="pointer-events-none -z-10 select-none"
                      />
                      <div className="flex items-center gap-2 px-4">
                        <Image
                          src={
                            passed
                              ? "/images/pixel-check-icon.png"
                              : "/images/pixel-x-icon.png"
                          }
                          alt="Regra"
                          width={18}
                          height={18}
                          className="pointer-events-none select-none"
                        />
                        <strong>Regra {index + 1}</strong>
                      </div>
                      <p className="flex flex-1 items-center px-4 text-sm leading-none">
                        <RuleMessage rule={rule} onlyText />
                      </p>
                    </div>
                  );
                })}
            </div>

            <Button
              className="font-monocraft ml-auto"
              onClick={handleCheck}
              disabled={isPending}
            >
              Confirmar {isPending && <Loader2Icon className="animate-spin" />}
            </Button>
          </div>
        )}

        {completed && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h2 className="font-upheaval text-6xl md:text-6xl">Parabéns!</h2>
            <p className="font-monocraft text-xl leading-none">
              Você criou sua senha e ganhou{" "}
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
