import { Button } from "@/components/ui/button";
import { getUserSession } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LearnerLinkCard } from "./_components/learner-link-card";
import { getLearnersByResponsibleId } from "@/utils/responsible-link";

export default async function LearnersPage() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const [learners, pending, rejected] = await Promise.all([
    getLearnersByResponsibleId(user.id, "ACCEPTED"),
    getLearnersByResponsibleId(user.id, "PENDING"),
    getLearnersByResponsibleId(user.id, "REJECTED"),
  ]);

  const notAcceptedLearners = [...pending, ...rejected];

  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex w-full flex-wrap justify-between gap-4">
        <h1 className="text-4xl font-bold">Aprendizes</h1>
        <Link href="/responsavel/aprendizes/adicionar">
          <Button>Adicionar aprendiz</Button>
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {learners.length > 0 ? (
          learners.map((responsibleLink) => (
            <LearnerLinkCard
              key={responsibleLink.id}
              responsibleLink={responsibleLink}
            />
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            Nenhum aprendiz encontrado.
          </p>
        )}
      </section>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Solicitações</h2>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {notAcceptedLearners.length > 0 ? (
            notAcceptedLearners.map((responsibleLink) => (
              <LearnerLinkCard
                key={responsibleLink.id}
                responsibleLink={responsibleLink}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-sm">
              Nenhuma solicitação encontrada.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
