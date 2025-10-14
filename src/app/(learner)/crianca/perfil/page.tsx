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

export default async function ProfilePage() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const xpTotal = user.xp;
  const streakTotal = await calculateStreak(user.id);

  return (
    <section className="bg-primary-800 outline-primary-400/40 ml-20 flex min-h-screen w-full flex-col rounded-tl-3xl rounded-bl-3xl outline">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-6 sm:grid sm:grid-cols-2">
        <Card className="bg-primary-900 border-primary-700 col-span-full rounded-3xl p-4">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-between">
            <div className="flex flex-wrap items-center gap-6 max-sm:justify-center">
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
                <p>{user.email}</p>
                <p>{formatDate(new Date(user.birthdate))}</p>
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
                  sizes="24"
                  priority
                  className="no-blur"
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
                  sizes="24"
                  priority
                  className="no-blur"
                />
              </AspectRatio>
            </div>
            <div>
              <p className="font-upheaval text-4xl">
                {streakTotal} dia{streakTotal === 1 ? "" : "s"}
              </p>
              <span className="font-monocraft text-white/50">de ofensiva</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
