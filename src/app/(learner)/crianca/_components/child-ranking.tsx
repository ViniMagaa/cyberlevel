import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getRanking } from "@/utils/ranking";
import Image from "next/image";

type ChildRankingProps = {
  userId: string;
};

export async function ChildRanking({ userId }: ChildRankingProps) {
  const ranking = await getRanking("CHILD");

  return (
    <div className="bg-primary-600 border-primary-500/40 no-scrollbar relative h-full space-y-6 overflow-auto rounded-xl border py-4">
      <h2 className="font-monocraft text-center text-2xl font-bold">Ranking</h2>

      <div className="grid">
        {ranking.map((user, index) => (
          <div
            key={user.id}
            className={cn(
              "bg-primary-600 flex items-center gap-2 px-4",
              user.id === userId && "bg-primary-700 sticky -bottom-4",
            )}
          >
            {index < 3 ? (
              <Image
                src={`/images/pixel-${
                  index === 0 ? "first" : index === 1 ? "second" : "third"
                }-place-medal.png`}
                alt={user.name}
                width={40}
                height={40}
                className="no-blur object-contain"
              />
            ) : (
              <p className="font-upheaval w-10 text-center text-3xl">
                {index + 1}º
              </p>
            )}

            <div className="flex flex-1 items-center justify-between gap-1 p-2">
              <Card className="bg-primary-500 border-primary-400 w-12 overflow-hidden rounded-sm p-0">
                <AspectRatio ratio={1}>
                  <Image
                    src={user.avatar?.imageUrl ?? "/images/profile-picture.png"}
                    alt={user.name}
                    fill
                    className="no-blur object-contain"
                  />
                </AspectRatio>
              </Card>
              <div className="flex flex-1 flex-col justify-between sm:flex-row">
                {user.id === userId ? (
                  <p className="font-monocraft text-xl font-semibold">Você</p>
                ) : (
                  <div>
                    <p className="font-monocraft">{user.name}</p>
                    <p className="font-monocraft text-sm text-white/50 max-sm:hidden">
                      @{user.username}
                    </p>
                  </div>
                )}
                <p className="font-upheaval text-2xl">{user.xp} XP</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
