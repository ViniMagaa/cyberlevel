import { ActivityType } from "@prisma/client";
import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const activitySchemas = {
  [ActivityType.FAKE_NEWS]: z.object({
    title: z.string().min(1, "Título é obrigatório"),
    subtitle: z.string().optional(),
    author: z.string().optional(),
    publicationDate: z.date("Data de publicação inválida").optional(),
    text: z.string().min(1, "Texto é obrigatório"),
    image: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, "O tamanho máximo é 5MB")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Apenas .jpg, .png e .webp são suportados",
      )
      .optional(),
    source: z.string().min(1, "Fonte é obrigatória"),
    isFake: z.boolean("Indique se é falsa ou verdadeira"),
    feedback: z.string().min(1, "Feedback é obrigatório"),
  }),
  [ActivityType.POST_OR_NOT]: z.object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    image: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, "O tamanho máximo é 5MB")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Apenas .jpg, .png e .webp são suportados",
      )
      .optional(),
    isSafe: z.boolean("Indique se a postagem é segura ou não"),
    justification: z.string().min(1, "Justificativa é obrigatória"),
  }),
};
