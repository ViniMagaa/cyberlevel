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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userRoles } from "@/utils/enums";
import { Prisma, UserRole } from "@prisma/client";
import { MoreHorizontal, Shield, Trash } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteUser, updateUserRole } from "../actions";

type UsersTableActionProps = {
  user: Prisma.UserGetPayload<{
    select: {
      id: true;
      name: true;
      email: true;
      role: true;
    };
  }>;
};

export function UsersTableActions({ user }: UsersTableActionProps) {
  const [isPending, startTransition] = useTransition();

  function handleChangeRole(role: UserRole) {
    startTransition(async () => {
      try {
        await updateUserRole(user.id, role);
        toast.success("Função atualizada");
      } catch (error) {
        console.error(error);
        toast.error("Erro ao atualizar função");
      }
    });
  }

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Alterar função</DropdownMenuLabel>
        {Object.entries(userRoles).map(([key, label]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleChangeRole(key as UserRole)}
            disabled={isPending || user.role === key}
            className="flex gap-2"
          >
            <Shield className="h-4 w-4" />
            {label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} disabled={isPending} asChild>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full" size="sm">
                <Trash /> Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita. O usuário{" "}
                  <strong>{user.name}</strong> ({user.email}) será removido
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
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
