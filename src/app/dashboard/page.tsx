import { redirect } from "next/navigation";
import { requireUserSession } from "@/lib/auth";

export default async function Dashboard() {
  const user = await requireUserSession();
  if (!user) return redirect("/entrar");

  switch (user.role) {
    case "ADMIN":
      return redirect("/admin");
    case "LEARNER":
      return redirect("/aprendiz");
    case "RESPONSIBLE":
      return redirect("/responsavel");
    default:
      return redirect("/");
  }
}
