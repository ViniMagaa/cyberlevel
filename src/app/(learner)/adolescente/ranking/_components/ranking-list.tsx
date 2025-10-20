import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ActivityProgress, Archetype, Avatar, User } from "@prisma/client";
import Image from "next/image";
import { StreakBadge } from "../../../../../components/streak-badge";

type RankingListProps = {
  users: (Pick<User, "id" | "name" | "username" | "xp"> & {
    currentArchetype?: Archetype | null;
    avatar: Avatar | null;
    activityProgress?: ActivityProgress[] | null;
  })[];
  userId: string;
  showArchetypeName?: boolean;
};

export function RankingList({
  users,
  userId,
  showArchetypeName = true,
}: RankingListProps) {
  return (
    <Card className="mx-auto w-full max-w-xl gap-0 overflow-hidden p-0">
      <ScrollArea className="h-96">
        {users.map((user, index) => (
          <div
            key={user.id}
            className={cn(
              "flex items-center px-4",
              user.id === userId && "sticky bottom-0 bg-neutral-950",
            )}
          >
            <p
              className={cn(
                "text-xl font-black sm:text-2xl",
                index === 0 && "text-yellow-500/90",
                index === 1 && "text-orange-800/90",
                index === 2 && "text-neutral-500/90",
              )}
            >
              {index + 1}º
            </p>

            <div className="flex flex-1 items-center justify-between gap-4 p-2">
              <div className="flex flex-1 items-center gap-2">
                <Card className="w-12 overflow-hidden rounded-sm p-0">
                  <AspectRatio ratio={1}>
                    <Image
                      src={
                        user.avatar?.imageUrl ?? "/images/profile-picture.png"
                      }
                      alt={user.name}
                      fill
                      className="no-blur object-contain"
                    />
                  </AspectRatio>
                </Card>
                <div className="flex items-center gap-2">
                  {user.id === userId ? (
                    <p className="text-xl font-bold">Você</p>
                  ) : (
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm font-thin text-white/50">
                        @{user.username}
                      </p>
                    </div>
                  )}
                  {user.activityProgress && (
                    <StreakBadge
                      activityProgresses={user.activityProgress}
                      small
                    />
                  )}
                </div>

                {showArchetypeName && (
                  <p
                    style={{
                      color: user.currentArchetype?.primaryColor,
                    }}
                    className="ml-auto hidden font-bold sm:block"
                  >
                    {user.currentArchetype?.name || "Sem arquétipo"}
                  </p>
                )}
              </div>

              <p className="text-xl font-black sm:text-2xl">{user.xp} XP</p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
}
