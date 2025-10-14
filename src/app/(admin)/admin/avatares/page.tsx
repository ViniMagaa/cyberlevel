import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { AvatarCard } from "./_components/avatar-card";

export default async function Avatars() {
  const avatars = await db.avatar.findMany();

  const childAvatars = avatars.filter((avatar) => avatar.ageGroup === "CHILD");
  const teenAvatars = avatars.filter((avatar) => avatar.ageGroup === "TEEN");

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex w-full flex-wrap justify-between gap-4">
        <h1 className="text-4xl font-bold">Avatares</h1>
        <Button type="button" asChild>
          <Link href="/admin/avatares/criar">Criar avatar</Link>
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-semibold">Crianças</h2>
        <span className="text-muted-foreground text-sm font-light">
          Aprendizes com até 11 anos
        </span>
      </div>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-9">
        {childAvatars.length > 0 ? (
          childAvatars.map((avatar) => (
            <AvatarCard key={avatar.id} avatar={avatar} />
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            Nenhum avatar encontrado.
          </p>
        )}
      </section>

      <Separator />

      <div>
        <h2 className="text-3xl font-semibold">Adolescentes</h2>
        <span className="text-muted-foreground text-sm font-light">
          Aprendizes com 12 anos ou mais
        </span>
      </div>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-9">
        {teenAvatars.length > 0 ? (
          teenAvatars.map((avatar) => (
            <AvatarCard key={avatar.id} avatar={avatar} />
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            Nenhum avatar encontrado.
          </p>
        )}
      </section>
    </div>
  );
}
