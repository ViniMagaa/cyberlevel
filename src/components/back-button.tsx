"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

type BackButtonProps = {
  size: "icon" | "default";
};

export function BackButton({ size }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button variant="ghost" size={size} onClick={() => router.back()}>
      <ArrowLeft />
      {size === "default" && "Voltar"}
    </Button>
  );
}
