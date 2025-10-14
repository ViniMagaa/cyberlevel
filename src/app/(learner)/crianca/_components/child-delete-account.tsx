"use client";

import { deleteUser } from "@/app/api/user-settings";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

type ChildDeleteAccountProps = {
  userId: string;
};

export function ChildDeleteAccount({ userId }: ChildDeleteAccountProps) {
  const [isPending, startTransition] = useTransition();

  function handleDeleteAccount() {
    toast("Tem certeza disso?", {
      action: {
        label: "Sim, excluir conta",
        onClick: () =>
          startTransition(async () => {
            try {
              await deleteUser(userId);
              toast.success("Usuário excluído");
            } catch (error) {
              console.error(error);
              toast.error("Erro ao excluir usuário");
            }
          }),
      },
    });
  }
  return (
    <Button
      variant="pixel"
      size="pixel"
      className="hue-rotate-200"
      onClick={handleDeleteAccount}
      disabled={isPending}
    >
      <div className="flex items-center gap-2 text-base">
        Excluir conta
        {isPending && <Loader2Icon className="animate-spin" />}
      </div>
    </Button>
  );
}
