"use client";

import { Logo } from "@/components/logo";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

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
    label: "Loja",
    href: "/adolescente/loja",
  },
  {
    label: "Perfil",
    href: "/adolescente/perfil",
  },
];

export function TeenNavbar() {
  return (
    <div>
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
    </div>
  );
}
