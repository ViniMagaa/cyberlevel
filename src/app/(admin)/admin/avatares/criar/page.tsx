import { AvatarForm } from "@/components/avatar-form";

export default function CreateAvatarPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Criar Avatar</h1>
      <div className="w-full max-w-md">
        <AvatarForm />
      </div>
    </div>
  );
}
