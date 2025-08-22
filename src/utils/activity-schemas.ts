import { ActivityType } from "@prisma/client";
import { z } from "zod";
import { ThemedPasswordRules, TThemedPasswordRules } from "./activity-types";

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
  [ActivityType.QUIZ]: z.object({
    title: z.string().min(1, "Título do quiz é obrigatório"),
    questions: z
      .array(
        z.object({
          text: z.string().min(1, "O enunciado da pergunta é obrigatório"),
          options: z
            .array(
              z.object({
                text: z.string().min(1, "Alternativa não pode ser vazia"),
              }),
            )
            .min(2, "Cada pergunta precisa de pelo menos 2 alternativas"),
          correctIndex: z
            .number()
            .int()
            .min(0, "O índice da alternativa correta deve ser válido"),
          feedback: z.string().min(1, "Feedback é obrigatório"),
        }),
      )
      .min(1, "O quiz deve ter pelo menos uma pergunta"),
  }),
  [ActivityType.THEMED_PASSWORD]: z.object({
    title: z.string().min(1, "Título da atividade é obrigatório"),
    mission: z.string().min(1, "Missão é obrigatória"),
    rules: z
      .array(
        z.object({
          type: z.enum(ThemedPasswordRules, "Selecione um tipo"),
          value: z.string().optional(),
        }),
      )
      .min(1, "É necessário definir pelo menos uma regra")
      .superRefine((rules, ctx) => {
        const types = rules
          .map((r) => r.type)
          .filter(Boolean) as TThemedPasswordRules[];
        if (new Set(types).size !== types.length) {
          ctx.addIssue({
            message: "Não é permitido repetir a mesma regra",
            path: [],
          });
        }

        const valueRequiredTypes: TThemedPasswordRules[] = [
          ThemedPasswordRules.MIN_LENGTH,
          ThemedPasswordRules.MAX_LENGTH,
          ThemedPasswordRules.INCLUDE_WORD,
          ThemedPasswordRules.EXCLUDE_WORD,
        ];

        rules.forEach((rule, index) => {
          if (valueRequiredTypes.includes(rule.type) && !rule.value?.trim()) {
            ctx.addIssue({
              message: "Valor obrigatório",
              path: [index, "value"],
            });
          }
        });
      }),
    feedback: z.string().min(1, "Feedback é obrigatório"),
  }),
  [ActivityType.FAKE_CHAT]: z.object({
    title: z.string().min(1, "Título é obrigatório"),
    messages: z
      .array(
        z.object({
          characterMessage: z
            .string()
            .min(1, "Mensagem do personagem é obrigatória"),
          options: z
            .array(
              z.object({
                text: z.string().min(1, "Texto da opção é obrigatório"),
                feedback: z.string().min(1, "Feedback é obrigatório"),
                isSafe: z.boolean("Indique se é segura"),
              }),
            )
            .min(1, "Deve ter pelo menos uma opção"),
        }),
      )
      .min(1, "Deve ter pelo menos uma mensagem"),
  }),
  [ActivityType.MATCH_PAIRS]: z.object({
    title: z.string().min(1, "Título é obrigatório"),
    concepts: z
      .array(
        z.object({
          term: z.string().min(1, "O termo é obrigatório"),
          definition: z.string().min(1, "A definição é obrigatória"),
        }),
      )
      .min(2, "Cadastre pelo menos 2 conceitos para formar pares"),
    timeLimit: z
      .number("Informe o limite de tempo")
      .min(1, "No mínimo 1 segundo"),
    maxAttempts: z
      .number("Informe a quantidade de tentativas")
      .min(1, "No mínimo 1 tentativa"),
    feedback: z.string().optional(),
  }),
  [ActivityType.INFORMATIVE_TEXT]: z.object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().optional(),
    content: z.string().min(1, "O conteúdo é obrigatório"),
    image: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, "O tamanho máximo é 5MB")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Apenas .jpg, .png e .webp são suportados",
      )
      .optional(),
  }),
};
