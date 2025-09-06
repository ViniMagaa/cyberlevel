"use client";

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
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { Trash } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteUser } from "../actions";
import UserDataForm from "./user-data-form";
import ChangePasswordForm from "./chage-password-form";

type SettingsActionsProps = {
  user: User;
};

export function SettingsActions({ user }: SettingsActionsProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteUser(user.id);
        toast.success("Usuário excluído");
      } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir usuário");
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <UserDataForm user={user} />

      <ChangePasswordForm user={user} />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <Trash /> Excluir conta
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Sua conta será removida
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
