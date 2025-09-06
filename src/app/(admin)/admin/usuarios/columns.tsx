"use client";

import { userRoles } from "@/utils/enums";
import { formatDate } from "@/utils/format-date";
import { Prisma, UserRole } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { UsersTableActions } from "./_components/users-table-actions";

type User = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    role: true;
    createdAt: true;
    birthdate: true;
  };
}>;

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "E-mail",
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: "Função",
    enableHiding: false,
    cell: ({ row }) => {
      return userRoles[row.original.role as unknown as UserRole];
    },
  },
  {
    accessorKey: "birthdate",
    header: "Nascimento",
    cell: ({ row }) => {
      return formatDate(row.original.birthdate);
    },
  },
  {
    accessorKey: "createdAt",
    header: "Cadastro",
    cell: ({ row }) => {
      return formatDate(row.original.createdAt);
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const user = row.original;
      return <UsersTableActions user={user} />;
    },
  },
];
