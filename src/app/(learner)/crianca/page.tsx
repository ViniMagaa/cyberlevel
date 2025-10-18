import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUserSession } from "@/lib/auth";
import { getResponsibleByLearnerId } from "@/utils/responsible-link";
import { calculateStreak } from "@/utils/streak";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChildRanking } from "./_components/child-ranking";
import { ChildSignOutButton } from "./_components/child-sign-out-button";
import { ResponsibleLinkNotifier } from "@/components/responsible-link-notifier";
import { cn } from "@/lib/utils";

export default async function Dashboard() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const xpTotal = user.xp;
  const [{ streak, isToday }, responsibleLinks] = await Promise.all([
    calculateStreak({ userId: user.id }),
    getResponsibleByLearnerId(user.id),
  ]);

  return (
    <section className="bg-primary-800 outline-primary-400/40 ml-20 flex min-h-screen w-full flex-col gap-4 rounded-tl-3xl rounded-bl-3xl p-4 outline sm:gap-6 sm:p-6 lg:flex-row lg:gap-0 lg:p-0">
      <ResponsibleLinkNotifier
        responsibleLinks={responsibleLinks}
        redirectTo="/crianca/perfil"
      />

      <div className="col-span-2 flex h-screen flex-1/2 auto-rows-min flex-col gap-4 sm:gap-6 lg:max-w-2xl lg:p-6">
        <Link href="/crianca/missoes" className="h-fit sm:col-span-2">
          <div className="bg-primary-600 group border-primary-500/40 relative overflow-hidden rounded-xl border">
            <AspectRatio ratio={16 / 9} className="relative overflow-hidden">
              <Image
                src="/images/pixel-tasks-background.png"
                alt="Missões"
                fill
                className="no-blur object-cover object-top transition group-hover:scale-105"
              />
              <div className="opacity-0 transition group-hover:opacity-100">
                <div className="absolute inset-0 grid place-items-center bg-black/40">
                  <Image
                    src="/images/pixel-trophy.png"
                    alt="Troféu"
                    width={100}
                    height={100}
                    className="no-blur -mt-12"
                  />
                </div>
              </div>
            </AspectRatio>
            <div className="bg-primary-600 absolute inset-x-0 bottom-0 rounded-xl p-2">
              <h2 className="font-upheaval group-hover:text-primary-300 text-center text-4xl transition">
                Missões
              </h2>
            </div>
          </div>
        </Link>

        <ChildRanking userId={user.id} />
      </div>
      <div className="bg-primary-900 outline-primary-700 flex min-w-fit flex-col gap-12 rounded-3xl rounded-bl-3xl p-4 outline sm:p-6 lg:flex-1 lg:rounded-tr-none lg:rounded-br-none">
        <div className="flex items-center justify-between gap-4">
          <div className="mx-auto flex flex-col items-center gap-4 text-center sm:mx-0 sm:flex-row sm:gap-6 sm:text-left">
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
            <div>
              <p className="font-monocraft text-2xl">{user.name}</p>
              <span className="font-monocraft text-white/50">
                @{user.username}
              </span>
            </div>
          </div>

          <div className="z-50 max-sm:fixed max-sm:bottom-4 max-sm:left-4">
            <ChildSignOutButton />
          </div>
        </div>

        <div className="mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-20">
          <div className="mx-auto flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
            <div className="mx-auto grid w-16 place-items-center sm:w-24">
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

          <div className="mx-auto flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
            <div className="mx-auto grid w-16 place-items-center sm:w-24">
              <AspectRatio ratio={1 / 1}>
                <Image
                  src="/images/pixel-clock-icon.png"
                  alt="Ofensiva"
                  fill
                  className={cn(
                    "no-blur",
                    !isToday
                      ? "grayscale"
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
        </div>

        <div className="bg-primary-600 border-primary-500/40 flex h-full flex-col gap-6 overflow-hidden rounded-xl border py-4">
          <h2 className="font-monocraft text-center text-2xl font-bold">
            Loja
          </h2>

          <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="size-20 sm:size-30">
              <AspectRatio ratio={1}>
                <Image
                  src="/images/pixel-gift.png"
                  alt="Presente"
                  fill
                  className="no-blur object-contain transition-transform hover:scale-110"
                />
              </AspectRatio>
            </div>

            <Link href="/crianca/loja">
              <Button variant="pixel" size="pixel">
                Ir para loja
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
