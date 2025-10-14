import { getUserSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ChildUpdateProfileForm from "../../_components/child-update-profile-form";

export default async function UpdateProfilePage() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const avatars = await db.avatar.findMany({
    where: { ageGroup: "CHILD" },
  });

  return (
    <section className="bg-primary-800 outline-primary-400/40 ml-20 flex min-h-screen w-full flex-col rounded-tl-3xl rounded-bl-3xl outline">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6">
        <ChildUpdateProfileForm user={user} avatars={avatars} />
      </div>
    </section>
  );
}
