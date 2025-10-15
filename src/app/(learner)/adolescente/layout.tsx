import { getUserSession } from "@/lib/auth";
import { TeenNavbar } from "./_components/teen-navbar";
import { redirect } from "next/navigation";

export default async function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  return (
    <div className="flex flex-col">
      <TeenNavbar userAvatarUrl={user.avatar?.imageUrl} />
      {children}
    </div>
  );
}
