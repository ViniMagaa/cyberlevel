"use client";

import { Logo } from "@/components/logo";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Archetype, User } from "@prisma/client";
import { ArrowRightLeft, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";

type TeenHeaderProps = {
  user: User;
  archetype: Archetype;
};

const menuItems = [
  {
    label: "Início",
    href: "/adolescente",
  },
  {
    label: "Ranking",
    href: "/adolescente/ranking",
  },
  {
    label: "Perfil",
    href: "/adolescente/perfil",
  },
];

export function TeenHeader({ user, archetype }: TeenHeaderProps) {
  return (
    <header className="flex flex-col">
      <nav className="flex items-center justify-between rounded-md px-6 py-4">
        <Logo />
        <menu className="flex items-center gap-2 sm:gap-4">
          {menuItems.map(({ href, label }, i) => (
            <Link key={i} href={href}>
              <Button variant="ghost" size="sm">
                {label}
              </Button>
            </Link>
          ))}
          <SignOutButton />
        </menu>
      </nav>

      <Separator />

      <div className="space-y-6 p-6">
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

        <div className="flex flex-wrap gap-4">
          <Card className="flex flex-1 flex-row items-center gap-4 p-4">
            <Sparkles
              style={{
                color: archetype.primaryColor,
              }}
            />
            <p className="text-lg uppercase">
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

          <Card className="flex flex-1 flex-row items-center gap-4 p-4">
            <Trophy
              style={{
                color: archetype.primaryColor,
              }}
            />
            <p className="text-lg uppercase">
              <span
                className="text-xl font-extrabold"
                style={{
                  color: archetype.primaryColor,
                }}
              >
                0
              </span>{" "}
              Conquistas
            </p>
          </Card>

          <Card className="flex flex-1 flex-row items-center justify-between gap-4 p-4">
            <p className="text-lg uppercase">
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
      </div>
    </header>
  );
}
