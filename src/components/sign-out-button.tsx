"use client";

import signOut from "@/app/api/sign-out";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

export function SignOutButton() {
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon">
          <LogOut />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Encerrar seção</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja encerrar sua seção?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleSignOut} disabled={isPending}>
            Encerrar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
