import { ActivityType, AgeGroup, UserRole } from "@prisma/client";
import { ThemedPasswordRules, TThemedPasswordRules } from "./activity-types";

export const ageGroup: Record<AgeGroup, string> = {
  [AgeGroup.CHILD]: "Crianças",
  [AgeGroup.TEEN]: "Adolescentes",
};

export const activityType: Record<ActivityType, string> = {
  [ActivityType.FAKE_NEWS]: "Fake News",
  [ActivityType.POST_OR_NOT]: "Postar ou não postar",
  [ActivityType.QUIZ]: "Quiz",
  [ActivityType.THEMED_PASSWORD]: "Senha criativa",
  [ActivityType.FAKE_CHAT]: "Chat falso",
  [ActivityType.MATCH_PAIRS]: "Pares iguais",
  [ActivityType.INFORMATIVE_TEXT]: "Texto informativo",
};

export const themedPasswordRuleType: Record<TThemedPasswordRules, string> = {
  [ThemedPasswordRules.MIN_LENGTH]: "Tamanho mínimo",
  [ThemedPasswordRules.MAX_LENGTH]: "Tamanho máximo",
  [ThemedPasswordRules.UPPERCASE]: "Pelo menos uma maiúscula",
  [ThemedPasswordRules.LOWERCASE]: "Pelo menos uma minúscula",
  [ThemedPasswordRules.NUMBER]: "Pelo menos um número",
  [ThemedPasswordRules.SPECIAL_CHAR]: "Pelo menos um símbolo",
  [ThemedPasswordRules.INCLUDE_WORD]: "Deve conter palavra",
  [ThemedPasswordRules.EXCLUDE_WORD]: "Não pode conter palavra",
};

export const userRoles: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Admin",
  [UserRole.LEARNER]: "Aprendiz",
  [UserRole.RESPONSIBLE]: "Responsável",
};
