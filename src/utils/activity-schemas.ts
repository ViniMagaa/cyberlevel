import { ActivityType } from "@prisma/client";
import { z } from "zod";

export const activitySchemas = {
  [ActivityType.FAKE_NEWS]: z.object({
    title: z.string().min(1, "Título é obrigatório"),
    text: z.string().min(1, "Texto é obrigatório"),
    imageUrl: z.string().optional(),
    source: z.string().min(1, "Fonte é obrigatória"),
    isFake: z.boolean("Indique se é falsa ou verdadeira"),
    feedback: z.string().min(1, "Feedback é obrigatório"),
  }),
};

export type TFakeNews = z.infer<typeof activitySchemas.FAKE_NEWS>;
