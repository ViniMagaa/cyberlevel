import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { activityType } from "@/utils/enums";
import { Activity, ActivityProgress } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type ChildActivityIslandProps = {
  activity: Activity;
  enabled: boolean;
  userProgress?: ActivityProgress;
  islandImageUrl: string;
  index: number;
};

export function ChildActivityIsland({
  activity,
  enabled,
  userProgress,
  islandImageUrl,
  index,
}: ChildActivityIslandProps) {
  const isMobile = useIsMobile();
  const status = userProgress?.status ?? "NOT_STARTED";

  return (
    <div
      className={cn(
        "group shrink-0 scale-75",
        !isMobile && "scale-100",
        !isMobile && (index % 2 === 0 ? "mt-16" : "-mt-16"),
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          className="relative outline-none"
          disabled={!userProgress && !enabled}
        >
          {enabled && (
            <Image
              src="/images/pixel-flag.png"
              alt="Próxima atividade"
              width={100}
              height={50}
              className={cn(
                "no-blur animate-float-diagonal absolute bottom-4/5 left-1/2 -translate-x-4/10 scale-75 transition-transform group-hover:-translate-y-6",
                !isMobile && "bottom-25 scale-100 group-hover:-translate-y-8",
              )}
              style={{
                animationDelay: `${index * 300}ms`,
                animationDuration: `${3000 + index * 500}ms`,
              }}
            />
          )}
          <Image
            src={
              !userProgress && !enabled
                ? "/images/pixel-inactive-island.png"
                : islandImageUrl
            }
            alt={activity.title}
            width={160}
            height={110}
            className={cn(
              "no-blur animate-float-diagonal brightness-80 drop-shadow-xl/25 transition select-none",
              (!!userProgress || enabled) &&
                "group-hover:scale-105 group-hover:brightness-100",
            )}
            style={{
              animationDelay: `${index * 300}ms`,
              animationDuration: `${3000 + index * 500}ms`,
            }}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="outline-primary-400/40 bg-primary-950">
          <DropdownMenuLabel className="font-monocraft text-center">
            {activity.title}
          </DropdownMenuLabel>
          <p className="font-monocraft text-muted-foreground px-1 text-center text-[10px]">
            {activityType[activity.type]}
          </p>
          <DropdownMenuSeparator />
          <div className="w-full p-2">
            {status === "COMPLETED" && userProgress ? (
              <div className="font-monocraft text-center text-sm">
                <p>
                  <span className="font-upheaval text-4xl">
                    {userProgress.xpEarned} XP
                  </span>
                </p>
                <p>
                  {userProgress.attempts} tentativa
                  {userProgress.attempts === 1 ? "" : "s"}
                </p>
              </div>
            ) : (
              <Link href={`/crianca/missoes/${activity.id}`}>
                <Button variant="pixel" size="pixel" className="m-auto">
                  {status === "IN_PROGRESS" && "Continuar"}
                  {status === "NOT_STARTED" && "Iniciar"}
                </Button>
              </Link>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

ChildActivityIsland.displayName = "ChildActivityIsland";
