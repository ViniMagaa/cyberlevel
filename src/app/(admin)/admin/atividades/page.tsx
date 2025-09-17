import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/prisma";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ModuleAccordion } from "./_components/module-accordion";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

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
        <h1 className="text-4xl font-extrabold">Atividades por módulo</h1>
        <div className="space-x-2">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/modulos/criar">Criar módulo</Link>
          </Button>
          <Button type="button" asChild>
            <Link href="/admin/atividades/criar">Criar atividade</Link>
          </Button>
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold">Crianças</h2>
        <span className="text-muted-foreground text-sm font-light">
          Aprendizes com até 11 anos
        </span>
      </div>
      {childrenModules.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nenhum módulo criado.</p>
      ) : (
        <ModuleAccordion modules={childrenModules} />
      )}

      <div className="mt-14">
        <h2 className="text-3xl font-bold">Adolescentes</h2>
        <span className="text-muted-foreground text-sm font-light">
          Aprendizes com 12 anos ou mais
        </span>
      </div>
      {teenArchetypes.map((archetype) => (
        <div key={archetype.id} className="space-y-6">
          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-start gap-2">
              <ChevronRight />
              <h3 className="text-xl font-semibold">{archetype.name}</h3>
            </div>
            <div className="ml-8 space-y-4">
              <div className="flex gap-4">
                <Card className="w-full max-w-40 overflow-hidden p-0">
                  <CardContent className="p-0">
                    {archetype.imageUrl ? (
                      <AspectRatio ratio={4 / 5}>
                        <Image
                          src={archetype.imageUrl}
                          alt={archetype.name}
                          fill
                          className="rounded-md object-cover"
                        />
                      </AspectRatio>
                    ) : (
                      <p className="text-muted-foreground">Sem imagem</p>
                    )}
                  </CardContent>
                </Card>
                <div className="flex-1 overflow-hidden">
                  <p className="text-muted-foreground line-clamp-[10] text-sm">
                    {archetype.description}
                  </p>
                </div>
              </div>
              {archetype.modules.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhum módulo criado.
                </p>
              ) : (
                <ModuleAccordion modules={archetype.modules} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
