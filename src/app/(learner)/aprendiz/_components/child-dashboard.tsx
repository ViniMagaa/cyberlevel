import { AspectRatio } from "@/components/ui/aspect-ratio";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { ChildSignOutButton } from "./child-sign-out-button";
import { calculateStreak } from "@/utils/strak";

type ChildDashboardProps = {
  user: User;
};

export default async function ChildDashboard({ user }: ChildDashboardProps) {
  const xpTotal = user.xp;
  const streakTotal = await calculateStreak(user.id);

  return (
    <section className="bg-primary-800 outline-primary-400/40 ml-20 flex min-h-screen w-full flex-col-reverse gap-4 rounded-tl-3xl rounded-bl-3xl p-4 outline sm:gap-6 sm:p-6 lg:flex-row lg:gap-0 lg:p-0">
      <div className="col-span-2 flex flex-1/2 auto-rows-min flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-2xl lg:p-6">
        <Link href="/aprendiz/missoes" className="h-fit sm:col-span-2">
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
        <div className="bg-primary-600 border-primary-500/40 h-full overflow-hidden rounded-xl border p-2">
          <h2 className="font-monocraft text-center text-xl">Ranking</h2>
        </div>
        <div className="bg-primary-600 border-primary-500/40 h-full overflow-hidden rounded-xl border p-2">
          <h2 className="font-monocraft text-center text-xl">Loja</h2>
        </div>
      </div>

      <div className="bg-primary-900 outline-primary-700 relative flex min-w-fit flex-col gap-12 rounded-3xl rounded-bl-3xl p-4 outline sm:p-6 lg:flex-1 lg:rounded-tr-none lg:rounded-br-none">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Image
              src="/images/profile-picture.png"
              alt="Usuário"
              width={100}
              height={100}
              className="no-blur rounded-xl object-cover"
            />
            <div>
              <p className="font-monocraft text-2xl">{user.name}</p>
              <span className="text-muted-foreground/80 font-monocraft">
                @{user.username}
              </span>
            </div>
          </div>

          <div className="max-sm:absolute max-sm:top-10 max-sm:right-4">
            <ChildSignOutButton />
          </div>
        </div>

        <div className="mx-auto flex flex-wrap items-center justify-center gap-20">
          <div className="mx-auto flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
            <div className="mx-auto grid h-24 w-24 place-items-center">
              <AspectRatio ratio={1 / 1}>
                <Image
                  src="/images/pixel-experience-icon.png"
                  alt="XP"
                  fill
                  sizes="24"
                  priority
                  className="no-blur"
                />
              </AspectRatio>
            </div>
            <div>
              <p className="font-upheaval text-4xl">{xpTotal}</p>
              <span className="text-muted-foreground font-monocraft">
                pontos de XP
              </span>
            </div>
          </div>

          <div className="mx-auto flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
            <div className="mx-auto grid w-24 place-items-center">
              <AspectRatio ratio={1 / 1}>
                <Image
                  src="/images/pixel-clock-icon.png"
                  alt="Ofensiva"
                  fill
                  sizes="24"
                  priority
                  className="no-blur"
                />
              </AspectRatio>
            </div>
            <div>
              <p className="font-upheaval text-4xl">{streakTotal} dias</p>
              <span className="text-muted-foreground font-monocraft">
                de ofensiva
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto space-y-4">
          <h2 className="font-upheaval text-center text-2xl sm:text-4xl">
            Conquistas
          </h2>

          <div className="flex flex-col gap-4 select-none sm:grid sm:grid-cols-3">
            <div className="bg-primary-600 border-primary-500/40 mx-auto grid h-32 w-32 place-items-center rounded-xl border">
              <h2 className="font-upheaval text-primary-400 text-center text-8xl">
                ?
              </h2>
            </div>
            <div className="bg-primary-600 border-primary-500/40 mx-auto grid h-32 w-32 place-items-center rounded-xl border">
              <h2 className="font-upheaval text-primary-400 text-center text-8xl">
                ?
              </h2>
            </div>
            <div className="bg-primary-600 border-primary-500/40 mx-auto grid h-32 w-32 place-items-center rounded-xl border">
              <h2 className="font-upheaval text-primary-400 text-center text-8xl">
                ?
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
