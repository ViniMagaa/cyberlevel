"use client";

import { Logo } from "@/components/logo";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LogOut, Menu, User, Users2, X } from "lucide-react";
import Image from "next/image";
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
];

type TeenNavbarProps = {
  userAvatarUrl?: string;
};

export function TeenNavbar({ userAvatarUrl }: TeenNavbarProps) {
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

      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-md px-6 py-4">
        <Logo path="/adolescente" />
        <menu className="flex items-center gap-2 sm:gap-4">
          <div
            className={cn(
              "fixed -top-full left-0 z-30 flex h-fit w-full flex-col gap-8 bg-black p-8 transition-[top] duration-500 sm:static sm:flex-row sm:gap-4 sm:p-0",
              isMenuActive && "top-0",
            )}
          >
            <div className="grid grid-cols-3 place-items-start items-center sm:hidden">
              <Logo onlyLogo path="/adolescente" />
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Image
                src={userAvatarUrl ?? "/images/profile-picture.png"}
                alt="Perfil"
                width={36}
                height={36}
                className="border-input rounded-full border object-cover object-center"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="m-2" align="start">
              <Link href="/adolescente/perfil">
                <DropdownMenuItem>
                  <User />
                  Perfil
                </DropdownMenuItem>
              </Link>
              <Link href="/adolescente/responsaveis">
                <DropdownMenuItem>
                  <Users2 />
                  Responsáveis
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <SignOutButton>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <LogOut /> Sair
                </DropdownMenuItem>
              </SignOutButton>
            </DropdownMenuContent>
          </DropdownMenu>

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
