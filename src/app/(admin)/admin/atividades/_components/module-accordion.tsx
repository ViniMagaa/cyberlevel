import { Accordion } from "@/components/ui/accordion";
import { Prisma } from "@prisma/client";
import { ModuleAccordionItem } from "./module-accordion-item";
import { Card, CardContent } from "@/components/ui/card";
import { ModuleOrderList } from "@/components/module-order-list";

type ModuleAccordionProps = {
  modules: Prisma.ModuleGetPayload<{
    include: {
      activities: true;
      archetype: true;
    };
  }>[];
};

export function ModuleAccordion({ modules }: ModuleAccordionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Módulos</h3>
        <ModuleOrderList modules={modules} />
      </div>
      <Card className="w-full py-0">
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {modules.map((module) => (
              <ModuleAccordionItem key={module.id} module={module} />
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
