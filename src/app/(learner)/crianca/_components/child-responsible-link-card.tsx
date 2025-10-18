"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  deleteResponsibleLinkById,
  updateResponsibleLinkById,
} from "@/utils/responsible-link";
import { ResponsibleLink, ResponsibleLinkStatus, User } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

type ChildResponsibleLinkCardProps = {
  responsibleLink: ResponsibleLink & { responsible: User };
};

export function ChildResponsibleLinkCard({
  responsibleLink: { id, responsible, status },
}: ChildResponsibleLinkCardProps) {
  const [isPendingUpdate, startUpdateTransition] = useTransition();
  const [isPendingDelete, startDeleteTransition] = useTransition();

  const router = useRouter();

  function handleUpdateResponsibleLink(status: ResponsibleLinkStatus) {
    startUpdateTransition(async () => {
      try {
        await updateResponsibleLinkById(id, { status });
        toast.success(
          `Solicitação ${status === "ACCEPTED" ? "aceita" : "recusada"}`,
        );
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Erro ao atualizar solicitação");
      }
    });
  }

  function handleDeleteResponsibleLink() {
    startDeleteTransition(async () => {
      try {
        await deleteResponsibleLinkById(id);
        toast.success("Responsável excluído");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir responsável");
      }
    });
  }

  return (
    <Card className="bg-primary-900 border-primary-700 flex flex-wrap justify-between gap-2 p-4">
      <div>
        <h2 className="font-monocraft line-clamp-1 text-xl break-all overflow-ellipsis">
          {responsible.name}
        </h2>
        <p className="font-monocraft line-clamp-1 text-sm break-all overflow-ellipsis text-white/50">
          {responsible.email}
        </p>
      </div>

      <div className="flex flex-wrap gap-4 *:flex-1">
        {status === "ACCEPTED" && (
          <Button
            variant="pixel"
            size="pixel"
            className="hue-rotate-200"
            onClick={handleDeleteResponsibleLink}
            disabled={isPendingDelete}
          >
            <div className="flex items-center gap-2 text-base">
              Remover
              {isPendingDelete && <Loader2Icon className="animate-spin" />}
            </div>
          </Button>
        )}

        {status === "PENDING" && (
          <>
            <Button
              variant="pixel"
              size="pixel"
              onClick={() => handleUpdateResponsibleLink("ACCEPTED")}
              disabled={isPendingUpdate}
            >
              Aceitar
            </Button>
            <Button
              variant="pixel"
              size="pixel"
              className="hue-rotate-200"
              onClick={() => handleUpdateResponsibleLink("REJECTED")}
              disabled={isPendingUpdate}
            >
              <div className="flex items-center gap-2 text-base">Recusar</div>
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
