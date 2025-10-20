import { LearnerForm } from "@/components/learner-form";
import { getUserSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AddLearnerPage() {
  const user = await getUserSession();
  if (!user) return redirect("/entrar");

  const learners = await db.user.findMany({
    where: { role: "LEARNER" },
    include: { avatar: true },
  });

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Adicionar Aprendiz</h1>
      <div className="w-full max-w-md">
        <LearnerForm responsibleId={user.id} learners={learners} />
      </div>
    </div>
  );
}
