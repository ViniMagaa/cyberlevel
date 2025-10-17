import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Archetype, Prisma } from "@prisma/client";
import { ArrowRightLeft, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StreakBadge } from "./streak-badge";

type TeenHeaderProps = {
  user: Prisma.UserGetPayload<{ include: { avatar: true } }>;
  archetype: Archetype;
};

export async function TeenHeader({ user, archetype }: TeenHeaderProps) {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-col items-center overflow-hidden md:flex-row">
      <div className="mx-auto w-full space-y-6 p-6">
        <div>
          <h1
            className="text-2xl font-bold uppercase sm:text-4xl"
            style={{
              color: archetype.primaryColor,
            }}
          >
            Bem vindo, {user.name}
          </h1>
          <p className="text-muted-foreground font-semibold">
            Continue sua jornada com {archetype.name}
          </p>
        </div>

        <div className="flex flex-col flex-wrap gap-4 sm:flex-row">
          <Card className="flex flex-1 flex-row items-center gap-4 rounded-md p-4">
            <Sparkles
              style={{
                color: archetype.primaryColor,
              }}
            />
            <p className="text-lg break-keep uppercase">
              <span
                className="text-xl font-extrabold"
                style={{
                  color: archetype.primaryColor,
                }}
              >
                {user.xp}
              </span>{" "}
              XP Total
            </p>
          </Card>

          <Card className="flex flex-1 flex-row items-center justify-between gap-2 rounded-md p-4">
            <p className="text-lg break-keep uppercase">
              Arquétipo{" "}
              <span
                className="text-xl font-extrabold"
                style={{
                  color: archetype.primaryColor,
                }}
              >
                {archetype.name}
              </span>
            </p>
            <Link href="/adolescente/arquetipos">
              <Button size="icon" variant="outline">
                <ArrowRightLeft />
              </Button>
            </Link>
          </Card>
        </div>

        <StreakBadge userId={user.id} />
      </div>

      {archetype.imageUrl && (
        <Image
          src={archetype.imageUrl}
          alt={archetype.name}
          width={200}
          height={200}
          className="object-contain object-bottom transition-transform duration-500 hover:scale-110"
        />
      )}
    </header>
  );
}
