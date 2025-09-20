"use client";

import signOut from "@/api/sign-out";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export function ChildSignOutButton() {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  function handleSignOut() {
    startTransition(async () => {
      try {
        const result = await signOut();

        if (result.success) {
          toast.success("Sessão encerrada com sucesso!");
          router.push("/");
        } else {
          toast.error(result.error.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro inesperado ao encerrar sessão");
      }
    });
  }

  return (
    <Button
      variant="pixel"
      size="pixel"
      className="px-3"
      onClick={handleSignOut}
      disabled={isPending}
    >
      <Image
        src="/images/pixel-exit-icon.png"
        alt="Sair"
        width={30}
        height={30}
        className="no-blur object-cover"
      />
    </Button>
  );
}
