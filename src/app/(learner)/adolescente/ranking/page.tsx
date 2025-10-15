import { getUserSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getRanking } from "@/utils/ranking";
import { redirect } from "next/navigation";
import { ArchetypeRankingDrawer } from "./_components/archetype-ranking-drawer";
import { RankingList } from "./_components/ranking-list";

export default async function RankingPage() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");
  const [ranking, archetypes] = await Promise.all([
    getRanking("TEEN"),
    db.archetype.findMany({
      include: {
        users: { orderBy: { xp: "desc" }, include: { avatar: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-12 px-4 pt-6 pb-18">
      <div className="space-y-6">
        <h1 className="text-center text-4xl font-extrabold">Ranking Geral</h1>

        <RankingList users={ranking} userId={user.id} />
      </div>

      <div className="space-y-6">
        <h1 className="text-center text-4xl font-extrabold">
          Ranking por arquétipo
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-8">
          {archetypes.map((archetype) => (
            <ArchetypeRankingDrawer
              key={archetype.id}
              archetype={archetype}
              userId={user.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
