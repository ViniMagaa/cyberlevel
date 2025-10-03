"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@prisma/client";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteAvatar } from "../actions";

type AvatarCardProps = {
  avatar: Avatar;
};

export function AvatarCard({ avatar }: AvatarCardProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteAvatar(avatar.id);
        toast.success("Avatar excluído com sucesso");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir avatar");
      }
    });
  }

  return (
    <Card
      key={avatar.id}
      className="relative h-full w-full overflow-hidden p-0"
    >
      {avatar.imageUrl && (
        <AspectRatio ratio={1}>
          <Image
            src={avatar.imageUrl}
            alt="Avatar"
            fill
            className="object-contain object-center"
          />
        </AspectRatio>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="bg-destructive/20 absolute h-full w-full rounded-none! opacity-0 transition-opacity hover:opacity-100"
            disabled={isPending}
          >
            <Trash className="size-8" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              Excluir avatar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
