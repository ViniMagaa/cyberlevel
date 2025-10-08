"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

type BackButtonProps = {
  size: "icon" | "default";
  path?: string;
};

export function BackButton({ size, path }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={() => (path ? router.push(path) : router.back())}
    >
      <ArrowLeft />
      {size === "default" && "Voltar"}
    </Button>
  );
}
