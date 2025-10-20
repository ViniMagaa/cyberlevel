import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUserSession } from "@/lib/auth";
import { formatDate } from "@/utils/format-date";
import { calculateStreak } from "@/utils/streak";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChildDeleteAccount } from "../_components/child-delete-account";
import { getResponsibleByLearnerId } from "@/utils/responsible-link";
import { ChildResponsibleLinkCard } from "../_components/child-responsible-link-card";
import { cn } from "@/lib/utils";

export default async function ProfilePage() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const xpTotal = user.xp;
  const [{ streak, isToday }, responsibleLinks] = await Promise.all([
    calculateStreak({ userId: user.id }),
    getResponsibleByLearnerId(user.id),
  ]);

  const acceptedResponsibleLinks = responsibleLinks.filter(
    ({ status }) => status === "ACCEPTED",
  );
  const pendingResponsibleLinks = responsibleLinks.filter(
    ({ status }) => status === "PENDING",
  );

  return (
    <section className="bg-primary-800 outline-primary-400/40 ml-20 flex min-h-screen w-full flex-col rounded-tl-3xl rounded-bl-3xl outline">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-6 sm:grid sm:grid-cols-2">
        <Card className="bg-primary-900 border-primary-700 col-span-full rounded-3xl p-4">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-between">
            <div className="flex flex-col flex-wrap items-center gap-6 max-sm:justify-center sm:flex-row">
              <Card className="bg-primary-600/20 border-primary-600 w-36 overflow-hidden p-0">
                <AspectRatio ratio={1}>
                  <Image
                    src={user.avatar?.imageUrl ?? "/images/profile-picture.png"}
                    alt="Avatar selecionado"
                    fill
                    className="no-blur size-full object-contain"
                  />
                </AspectRatio>
              </Card>
              <div className="font-monocraft text-center sm:text-left">
                <p className="text-2xl">{user.name}</p>
                <span className="text-white/50">@{user.username}</span>
                <p className="text-sm">{user.email}</p>
                <p className="text-sm">
                  {formatDate(new Date(user.birthdate))}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Link href="perfil/editar" className="sm:ml-auto">
                <Button variant="pixel" size="pixel">
                  Editar dados
                </Button>
              </Link>

              <ChildDeleteAccount userId={user.id} />
            </div>
          </div>
        </Card>

        <Card className="bg-primary-900 border-primary-700 rounded-3xl p-4">
          <div className="mx-auto flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
            <div className="mx-auto grid h-24 w-24 place-items-center">
              <AspectRatio ratio={1 / 1}>
                <Image
                  src="/images/pixel-experience-icon.png"
                  alt="XP"
                  fill
                  className="no-blur transition-transform hover:scale-110"
                />
              </AspectRatio>
            </div>
            <div>
              <p className="font-upheaval text-4xl">{xpTotal}</p>
              <span className="font-monocraft text-white/50">pontos de XP</span>
            </div>
          </div>
        </Card>

        <Card className="bg-primary-900 border-primary-700 rounded-3xl p-4">
          <div className="mx-auto flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
            <div className="mx-auto grid w-24 place-items-center">
              <AspectRatio ratio={1 / 1}>
                <Image
                  src="/images/pixel-clock-icon.png"
                  alt="Ofensiva"
                  fill
                  className={cn(
                    "no-blur",
                    !isToday
                      ? "opacity-70 grayscale"
                      : "transition-transform hover:scale-110",
                  )}
                />
              </AspectRatio>
            </div>
            <div>
              <p className="font-upheaval text-4xl">
                {streak} dia{streak === 1 ? "" : "s"}
              </p>
              <span className="font-monocraft text-white/50">de ofensiva</span>
            </div>
          </div>
        </Card>

        <section className="col-span-full space-y-2">
          <h1 className="font-upheaval text-2xl sm:text-4xl">Responsáveis</h1>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {acceptedResponsibleLinks.length > 0 ? (
              acceptedResponsibleLinks.map((responsibleLink) => (
                <ChildResponsibleLinkCard
                  key={responsibleLink.id}
                  responsibleLink={responsibleLink}
                />
              ))
            ) : (
              <p className="font-monocraft text-sm text-white/50">
                Nenhum encontrado.
              </p>
            )}
          </div>
        </section>

        <section className="col-span-full space-y-2">
          <h1 className="font-upheaval text-2xl sm:text-4xl">Solicitações</h1>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {pendingResponsibleLinks.length > 0 ? (
              pendingResponsibleLinks.map((responsibleLink) => (
                <ChildResponsibleLinkCard
                  key={responsibleLink.id}
                  responsibleLink={responsibleLink}
                />
              ))
            ) : (
              <p className="font-monocraft text-sm text-white/50">
                Nenhuma encontrada.
              </p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
