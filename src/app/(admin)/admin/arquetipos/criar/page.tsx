import { ArchetypeForm } from "@/components/archetype-form";

export default function CreateArchetypePage() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Criar Arquétipo</h1>
      <div className="w-full max-w-md">
        <ArchetypeForm />
      </div>
    </div>
  );
}
