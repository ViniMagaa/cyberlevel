import { TFakeChatForm } from "@/components/fake-chat-form";
import { TFakeNewsForm } from "@/components/fake-news-form";
import { TMatchPairsForm } from "@/components/match-pairs-form";
import { TPostOrNotForm } from "@/components/post-or-not-form";
import { TQuizForm } from "@/components/quiz-form";
import { TThemedPasswordForm } from "@/components/themed-password-form";

export type TFakeNewsContent = Omit<TFakeNewsForm, "image"> & {
  imageUrl?: string;
};

export type TPostOrNotContent = Omit<TPostOrNotForm, "image"> & {
  imageUrl?: string;
};

export type TQuizContent = TQuizForm;

export type TThemedPasswordContent = TThemedPasswordForm;

export const ThemedPasswordRules = {
  MIN_LENGTH: "MIN_LENGTH", // tamanho mínimo
  MAX_LENGTH: "MAX_LENGTH", // tamanho máximo
  UPPERCASE: "UPPERCASE", // pelo menos uma maiúscula
  LOWERCASE: "LOWERCASE", // pelo menos uma minúscula
  NUMBER: "NUMBER", // pelo menos um número
  SPECIAL_CHAR: "SPECIAL_CHAR", // pelo menos um símbolo
  INCLUDE_WORD: "INCLUDE_WORD", // deve conter uma palavra
  EXCLUDE_WORD: "EXCLUDE_WORD", // não pode conter palavra
} as const;

export type TThemedPasswordRules = keyof typeof ThemedPasswordRules;

export type TFakeChatContent = TFakeChatForm;

export type TMatchPairsContent = TMatchPairsForm;
