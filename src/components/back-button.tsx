"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

type BackButtonProps = React.ComponentProps<"button"> & {
  size?: "icon" | "default";
  path?: string;
};

export function BackButton({
  size = "default",
  path,
  ...props
}: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      {...props}
      variant="ghost"
      size={size}
      onClick={() => (path ? router.push(path) : router.back())}
    >
      <ArrowLeft />
      {size === "default" && "Voltar"}
    </Button>
  );
}
