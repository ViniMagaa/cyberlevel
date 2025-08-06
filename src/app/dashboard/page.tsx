import { redirect } from "next/navigation";
import { requireUserSession } from "@/lib/auth";

export default async function Dashboard() {
  const user = await requireUserSession();
  if (!user) return redirect("/entrar");

  switch (user.role) {
    case "ADMIN":
      return redirect("/admin");
    case "LEARNER":
      return redirect("/learner");
    case "RESPONSIBLE":
      return redirect("/responsible");
    default:
      return redirect("/");
  }
}
