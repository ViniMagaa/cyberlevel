"use client";

import { Logo } from "@/components/logo";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
  const [isMenuActive, setIsMenuActive] = useState(false);

  function handleToggleMenu() {
    setIsMenuActive((prev) => !prev);
  }

  return (
    <div>
      <div
        className={cn(
          "fixed inset-0 -z-10 bg-black/60 opacity-0 transition sm:hidden",
          isMenuActive && "z-10 opacity-100",
        )}
        onClick={handleToggleMenu}
      />

      <nav className="flex items-center justify-between rounded-md px-6 py-4">
        <Logo />
        <menu className="flex items-center gap-2 sm:gap-4">
          <div
            className={cn(
              "fixed -top-full left-0 z-30 flex h-fit w-full flex-col gap-8 bg-black p-8 transition-[top] duration-500 sm:static sm:flex-row sm:gap-4 sm:p-0",
              isMenuActive && "top-0",
            )}
          >
            <div className="grid grid-cols-3 place-items-start items-center sm:hidden">
              <Logo onlyLogo />
              <p className="place-self-center text-2xl font-extrabold">Menu</p>
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleMenu}
                className="place-self-end"
              >
                <X />
              </Button>
            </div>
            <Separator className="block sm:hidden" />
            {menuItems.map(({ href, label }, i) => (
              <Link key={i} href={href}>
                <Button
                  variant="ghost"
                  className="w-full text-xl sm:w-auto sm:text-sm"
                >
                  {label}
                </Button>
              </Link>
            ))}
          </div>
          <SignOutButton />
          <Button
            className="inline-flex sm:hidden"
            variant="outline"
            size="icon"
            onClick={handleToggleMenu}
          >
            <Menu />
          </Button>
        </menu>
      </nav>
      <Separator />
    </div>
  );
}
