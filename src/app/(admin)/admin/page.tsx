import { requireUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await requireUserSession();
  if (!user || user.role !== "ADMIN") return redirect("/dashboard");

  return <h1>Admin</h1>;
}
