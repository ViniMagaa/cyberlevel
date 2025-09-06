import { UsersTable } from "./_components/users-table";
import { getUsers } from "./actions";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex w-full flex-wrap justify-start gap-4">
        <h1 className="text-4xl font-bold">Usuários</h1>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
