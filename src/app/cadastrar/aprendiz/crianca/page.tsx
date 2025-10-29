import { db } from "@/lib/prisma";
import Image from "next/image";
import ChildRegisterForm from "./_components/child-register-form";
import { BackButton } from "@/components/back-button";

export default async function ChildRegisterPage() {
  const avatars = await db.avatar.findMany({
    where: { ageGroup: "CHILD" },
  });

  return (
    <div className="relative min-h-screen w-screen">
      <BackButton size="icon" className="fixed top-4 left-4" />

      <Image
        src="/images/pixel-child-register-background.jpg"
        alt="Background"
        fill
        className="absolute inset-0 -z-10 object-cover opacity-40"
      />

      <ChildRegisterForm avatars={avatars} />
    </div>
  );
}
