import { getUserSession } from "@/lib/auth";
import { getResponsibleByLearnerId } from "@/utils/responsible-link";
import { redirect } from "next/navigation";
import { TeenResponsibleLinkCard } from "./_components/teen-responsible-link-card";

export default async function ResponsiblesPage() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const responsibleLinks = await getResponsibleByLearnerId(user.id);

  const acceptedResponsibleLinks = responsibleLinks.filter(
    ({ status }) => status === "ACCEPTED",
  );
  const pendingResponsibleLinks = responsibleLinks.filter(
    ({ status }) => status === "PENDING",
  );

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-6">
      <section className="col-span-full space-y-2">
        <h1 className="text-2xl font-bold sm:text-4xl">Responsáveis</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {acceptedResponsibleLinks.length > 0 ? (
            acceptedResponsibleLinks.map((responsibleLink) => (
              <TeenResponsibleLinkCard
                key={responsibleLink.id}
                responsibleLink={responsibleLink}
              />
            ))
          ) : (
            <p className="text-sm text-white/50">Nenhum encontrado.</p>
          )}
        </div>
      </section>

      <section className="col-span-full space-y-2">
        <h1 className="text-2xl font-bold sm:text-4xl">Solicitações</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {pendingResponsibleLinks.length > 0 ? (
            pendingResponsibleLinks.map((responsibleLink) => (
              <TeenResponsibleLinkCard
                key={responsibleLink.id}
                responsibleLink={responsibleLink}
              />
            ))
          ) : (
            <p className="text-sm text-white/50">Nenhuma encontrada.</p>
          )}
        </div>
      </section>
    </div>
  );
}
