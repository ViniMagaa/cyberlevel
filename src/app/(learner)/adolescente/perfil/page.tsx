import { SettingsActions } from "@/components/settings-actions";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUserSession } from "@/lib/auth";
import { formatDate } from "@/utils/format-date";
import Image from "next/image";
import { redirect } from "next/navigation";
import { TeenNavbar } from "../_components/teen-navbar";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { ChangeAvatarDialog } from "./_components/change-avatar-dialog";
import { db } from "@/lib/prisma";

export default async function ProfilePage() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const avatars = await db.avatar.findMany({ where: { ageGroup: "TEEN" } });

  return (
    <div className="w-full space-y-6">
      <TeenNavbar userAvatarUrl={user.avatar?.imageUrl} />

      <h1 className="text-center text-4xl font-bold">Configurar perfil</h1>

      <div className="mx-auto max-w-2xl space-y-4 px-4 pb-6">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <Card className="overflow-hidden p-0">
              <AspectRatio ratio={1}>
                <Image
                  src={user.avatar?.imageUrl ?? "/images/profile-picture.png"}
                  alt="Avatar selecionado"
                  fill
                  className="no-blur size-full object-contain"
                />
              </AspectRatio>
            </Card>
            <ChangeAvatarDialog avatars={avatars} user={user} />
          </div>
          <div className="flex flex-col gap-4">
            <Card className="overflow-hidden p-0">
              <AspectRatio ratio={1}>
                <Image
                  src={
                    user.currentArchetype?.imageUrl ??
                    "/images/profile-picture.png"
                  }
                  alt="Avatar selecionado"
                  fill
                  className="no-blur size-full object-contain"
                />
              </AspectRatio>
            </Card>

            <Link href="/adolescente/arquetipos">
              <Button variant="outline" className="w-full">
                Trocar arquétipo <ArrowRightLeft />
              </Button>
            </Link>
          </div>
        </div>

        <Card className="p-4">
          <CardContent className="space-y-4 p-0">
            <div className="text-md flex justify-between sm:text-xl">
              <strong>Nome</strong> <span>{user.name}</span>
            </div>
            <Separator />
            <div className="text-md flex justify-between sm:text-xl">
              <strong>Nome de usuário</strong> <span>{user.username}</span>
            </div>
            <Separator />
            <div className="text-md flex justify-between sm:text-xl">
              <strong>E-mail</strong> <span>{user.email}</span>
            </div>
            <Separator />
            <div className="text-md flex justify-between sm:text-xl">
              <strong>Nascimento</strong>{" "}
              <span>{formatDate(new Date(user.birthdate))}</span>
            </div>
          </CardContent>
        </Card>

        <SettingsActions user={user} />
      </div>
    </div>
  );
}
