"use client";

import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userRoles } from "@/utils/enums";
import { Prisma, UserRole } from "@prisma/client";
import { useState } from "react";
import { columns } from "../columns";

type UsersTableProps = {
  users: Prisma.UserGetPayload<{
    select: {
      id: true;
      name: true;
      email: true;
      role: true;
      ageGroup: true;
      createdAt: true;
      birthdate: true;
    };
  }>[];
};

export function UsersTable({ users }: UsersTableProps) {
  const [role, setRole] = useState<UserRole | "ALL" | "">("");

  const filteredUsers =
    !role.length || role === "ALL"
      ? users
      : users.filter((user) => user.role === role);

  return (
    <div className="space-y-4">
      <Select
        value={role}
        onValueChange={(value) => setRole(value as UserRole)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar pela função" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todas</SelectItem>
          <SelectItem value={UserRole.ADMIN}>{userRoles.ADMIN}</SelectItem>
          <SelectItem value={UserRole.LEARNER}>{userRoles.LEARNER}</SelectItem>
          <SelectItem value={UserRole.RESPONSIBLE}>
            {userRoles.RESPONSIBLE}
          </SelectItem>
        </SelectContent>
      </Select>

      <DataTable
        columns={columns}
        data={filteredUsers}
        defaultColumnFilters={[
          { id: "name", value: "" },
          { id: "email", value: "" },
        ]}
      />
    </div>
  );
}
