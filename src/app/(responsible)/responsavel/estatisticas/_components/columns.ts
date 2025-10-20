"use client";

import { activityType } from "@/utils/enums";
import { Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type StatsColumns = Prisma.ActivityProgressGetPayload<{
  include: {
    activity: {
      select: {
        type: true;
        title: true;
        module: {
          include: {
            archetype: true;
          };
        };
      };
    };
  };
}>;

export const columns: ColumnDef<StatsColumns>[] = [
  {
    accessorKey: "activity.title",
    header: "Atividade",
  },
  {
    accessorFn: ({ activity }) => {
      return activityType[activity.type];
    },
    header: "Tipo",
  },
  {
    accessorFn: ({ activity }) => {
      return activity.module.title;
    },
    header: "Módulo",
  },
  {
    accessorFn: ({ activity }) => {
      return activity.module.archetype?.name;
    },
    header: "Arquétipo",
  },
  {
    accessorFn: ({ xpEarned }) => {
      return xpEarned + " XP";
    },
    header: "XP ganho",
  },
  {
    accessorFn: ({ completedAt }) => {
      return completedAt
        ? formatDistanceToNow(completedAt, { addSuffix: true, locale: ptBR })
        : "";
    },
    header: "Concluído",
  },
];
