"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const menuItems = [
  {
    label: "Início",
    href: "/crianca",
    image: "/images/pixel-home-icon.png",
  },
  {
    label: "Missões",
    href: "/crianca/missoes",
    image: "/images/pixel-tasks-icon.png",
  },
  {
    label: "Perfil",
    href: "/crianca/perfil",
    image: "/images/pixel-user-icon.png",
  },
];

export function ChildSidebar() {
  const [isMenuActive, setIsMenuActive] = useState(false);

  function handleToggleMenu() {
    setIsMenuActive((prev) => !prev);
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 -z-10 bg-black/60 opacity-0 transition",
          isMenuActive && "z-10 opacity-100",
        )}
        onClick={handleToggleMenu}
      />

      <div
        className={cn(
          "bg-primary-900 fixed z-50 flex h-full w-18 flex-col gap-12 overflow-x-clip rounded p-4 transition-all",
          isMenuActive && "w-72",
        )}
      >
        <div
          className="grid w-12 cursor-pointer place-items-center"
          onClick={handleToggleMenu}
        >
          <AspectRatio ratio={1 / 1}>
            <Image
              src="/images/pixel-menu-icon.png"
              alt="Menu"
              width={50}
              height={50}
              className="no-blur"
            />
          </AspectRatio>
        </div>

        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            onClick={() => setIsMenuActive(false)}
            className="group relative"
          >
            <div className="grid w-12 place-items-center">
              <AspectRatio ratio={1 / 1}>
                <Image
                  src={item.image}
                  alt={item.label}
                  width={50}
                  height={50}
                  className="no-blur"
                />
              </AspectRatio>
            </div>

            <p className="font-monocraft group-hover:text-primary-300 absolute top-1/2 left-20 -translate-y-1/2 text-2xl">
              {item.label}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
