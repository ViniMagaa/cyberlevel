import { getUserSession } from "@/lib/auth";
import { getLearnersByResponsibleId } from "@/utils/responsible-link";
import { redirect } from "next/navigation";
import LearnerStatsDrawer from "./_components/learner-stats-drawer";

export default async function ResponsibleStatsListPage() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const learners = await getLearnersByResponsibleId(user.id, "ACCEPTED");

  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Estatísticas</h1>
          <p className="text-muted-foreground">
            Veja o progresso e desempenho de cada aprendiz vinculado
          </p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {learners.length > 0 ? (
          learners.map(({ id, learner }) => (
            <LearnerStatsDrawer key={id} learner={learner} />
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            Nenhum aprendiz encontrado.
          </p>
        )}
      </section>
    </div>
  );
}
