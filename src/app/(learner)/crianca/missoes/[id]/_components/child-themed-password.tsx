"use client";

import { RuleMessage } from "@/components/rule-message";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/hooks/use-activity";
import { cn } from "@/lib/utils";
import { TThemedPasswordContent } from "@/utils/activity-types";
import { activityType } from "@/utils/enums";
import { Prisma } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
    if (validateRule(currentRule)) {
      if (currentRuleIndex + 1 < themedPassword.rules.length) {
        setCurrentRuleIndex((prev) => prev + 1);
      } else {
        complete();
      }
    }
  }

  return (
    <div className="h-full w-full">
      <Image
        src="/images/pixel-themed-password-background.png"
        alt="Themed Password"
        fill
        className="no-blur fixed -z-10 object-cover brightness-90"
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
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                onChange={(e) => setPassword(e.target.value)}
                className="font-monocraft absolute inset-0 h-full w-full bg-transparent px-6 text-xl text-black outline-none"
              />
            </div>

            <div className="flex flex-col-reverse gap-4">
              {themedPassword.rules.map((rule, index) => {
                const passed = validateRule(rule);

                return (
                  <div
                    key={index}
                    className={cn(
                      "font-monocraft relative flex h-[80px] translate-y-2 flex-col gap-2 py-1 text-base text-black opacity-0 transition-all duration-500",
                      currentRuleIndex >= index &&
                        "static translate-0 opacity-100",
                      index > currentRuleIndex && "absolute",
                    )}
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
