import { Accordion } from "@/components/ui/accordion";
import { Prisma } from "@prisma/client";
import { ModuleAccordionItem } from "./module-accordion-item";

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
    <Accordion type="multiple" className="w-full">
      {modules.map((module) => (
        <ModuleAccordionItem key={module.id} module={module} />
      ))}
    </Accordion>
  );
}
