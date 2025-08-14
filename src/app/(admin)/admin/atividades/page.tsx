import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/prisma";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ModuleAccordion } from "./_components/module-accordion";

export default async function Activities() {
  const [childrenModules, teenArchetypes] = await Promise.all([
    db.module.findMany({
      include: {
        activities: { orderBy: { order: "asc" } },
        archetype: true,
      },
      where: { ageGroup: "CHILD" },
      orderBy: { order: "asc" },
    }),
    db.archetype.findMany({
      include: {
        modules: {
          include: {
            activities: { orderBy: { order: "asc" } },
            archetype: true,
          },
          orderBy: { order: "asc" },
        },
      },
      where: { modules: { every: { ageGroup: "TEEN" } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="w-full space-y-6 p-4">
      <div className="flex w-full flex-wrap justify-between gap-2">
        <h1 className="text-4xl font-bold">Atividades por módulo</h1>
        <Button type="button" asChild>
          <Link href="/admin/modulos/criar">Criar módulo</Link>
        </Button>
      </div>
      <div>
        <h2 className="text-3xl font-semibold">Crianças</h2>
        <span className="text-muted-foreground text-sm font-light">
          Aprendizes com até 11 anos
        </span>
      </div>
      <ModuleAccordion modules={childrenModules} />
      <Separator />
      <div>
        <h2 className="text-3xl font-semibold">Adolescentes</h2>
        <span className="text-muted-foreground text-sm font-light">
          Aprendizes com 12 anos ou mais
        </span>
      </div>
      {teenArchetypes.map((archetype) => (
        <div key={archetype.id} className="space-y-2">
          <div className="flex items-center justify-start gap-2">
            <ChevronRight />
            <h3 className="text-xl font-medium">{archetype.name}</h3>
          </div>
          <div className="ml-8 space-y-4">
            <p className="text-muted-foreground line-clamp-3 text-sm">
              {archetype.description}
            </p>

            {archetype.modules.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Nenhum módulo criado.
              </p>
            ) : (
              <ModuleAccordion modules={archetype.modules} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
