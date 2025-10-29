import { db } from "@/lib/prisma";
import { TeenRegisterForm } from "./_components/teen-register-form";
import { BackButton } from "@/components/back-button";

export default async function ChildRegisterPage() {
  const avatars = await db.avatar.findMany({
    where: { ageGroup: "TEEN" },
  });

  return (
    <div className="relative h-screen w-screen">
      <BackButton size="icon" className="fixed top-4 left-4 z-10" />

      <TeenRegisterForm avatars={avatars} />
    </div>
  );
}
