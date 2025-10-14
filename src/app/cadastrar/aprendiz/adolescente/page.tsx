import { db } from "@/lib/prisma";
import { TeenRegisterForm } from "./_components/teen-register-form";

export default async function ChildRegisterPage() {
  const avatars = await db.avatar.findMany({
    where: { ageGroup: "TEEN" },
  });

  return (
    <div className="relative h-screen w-screen">
      <TeenRegisterForm avatars={avatars} />
    </div>
  );
}
