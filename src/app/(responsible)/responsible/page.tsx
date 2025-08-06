import { requireUserSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await requireUserSession();
  if (!user || user.role !== "RESPONSIBLE") return redirect("/dashboard");

  return <h1>Responsável</h1>;
}
