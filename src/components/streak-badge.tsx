import { cn } from "@/lib/utils";
import { calculateStreak } from "@/utils/streak";
import { ActivityProgress } from "@prisma/client";
import Image from "next/image";

type StreakBadgeProps = {
  userId?: string;
  activityProgresses?: ActivityProgress[];
  small?: boolean;
};

export async function StreakBadge({
  userId,
  activityProgresses,
  small = false,
}: StreakBadgeProps) {
  const { streak, isToday } = await calculateStreak({
    userId,
    activityProgresses,
  });

  return (
    <div className="flex items-center gap-2">
      <Image
        src="/images/streak-icon.png"
        alt="Ofensiva"
        width={200}
        height={200}
        className={cn(
          small ? "size-6" : "size-8",
          (streak === 0 || !isToday) && "grayscale",
          isToday &&
            "animate-scale transition-transform duration-500 hover:rotate-y-180",
        )}
      />

      <p className="text-md text-white/50">
        <span
          className="text-xl font-extrabold"
          style={{ color: isToday ? "#ff9000" : undefined }}
        >
          {streak}
        </span>{" "}
        {!small && `dia${streak !== 1 ? "s" : ""} de ofensiva`}
      </p>
    </div>
  );
}
