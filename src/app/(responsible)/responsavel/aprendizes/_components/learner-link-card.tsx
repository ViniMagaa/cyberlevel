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
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { responsibleLinkStatus } from "@/utils/enums";
import { formatDate } from "@/utils/format-date";
import { deleteResponsibleLinkById } from "@/utils/responsible-link";
import { Avatar, ResponsibleLink, User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2Icon, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

type LearnerLinkCardProps = {
  responsibleLink: ResponsibleLink & {
    learner: User & { avatar: Avatar | null };
  };
};

export function LearnerLinkCard({
  responsibleLink: { id, learner, createdAt, status },
}: LearnerLinkCardProps) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteResponsibleLinkById(id);
        toast.success("Aprendiz excluído");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir aprendiz");
      }
    });
  }

  return (
    <Card className="p-2">
      <CardContent className="flex flex-1 flex-col gap-2 p-0">
        <div className="flex flex-row flex-wrap gap-2 sm:flex-nowrap">
          <div className="h-25 w-25 overflow-hidden rounded-md bg-neutral-950">
            <AspectRatio ratio={1}>
              <Image
                src={learner.avatar?.imageUrl ?? "/images/profile-picture.png"}
                alt={learner.name}
                fill
                className="no-blur size-full object-contain"
              />
            </AspectRatio>
          </div>
          <div>
            <CardTitle className="line-clamp-1 text-xl font-bold break-all overflow-ellipsis">
              {learner.name}
            </CardTitle>
            <p className="line-clamp-1 text-sm break-all overflow-ellipsis text-white/50">
              {learner.email}
            </p>
            <p className="line-clamp-1 text-sm break-all overflow-ellipsis text-white/50">
              @{learner.username}
            </p>
            <p className="text-sm text-white/50">
              Entrou em {formatDate(learner.createdAt)}
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="ml-auto self-end"
                disabled={isPending}
                size="icon"
              >
                {isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <Trash />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Você deseja remover o aprendiz <strong>{learner.name}</strong>
                  ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                  Remover
                  {isPending && <Loader2Icon className="animate-spin" />}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {status !== "ACCEPTED" && (
          <>
            <Separator />
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-white/50">
                Enviado{" "}
                {formatDistanceToNow(createdAt, {
                  locale: ptBR,
                  addSuffix: true,
                })}
              </p>
              <Badge
                variant={
                  status === "PENDING"
                    ? "secondary"
                    : status === "REJECTED"
                      ? "destructive"
                      : "default"
                }
              >
                {responsibleLinkStatus[status]}
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
