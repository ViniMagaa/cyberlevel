import { ActivityType, AgeGroup } from "@prisma/client";

export const ageGroup: Record<AgeGroup, string> = {
  [AgeGroup.CHILD]: "Crianças",
  [AgeGroup.TEEN]: "Adolescentes",
};

export const activityType: Record<ActivityType, string> = {
  [ActivityType.FAKE_NEWS]: "Fake News",
  [ActivityType.POST_OR_NOT]: "Postar ou não postar",
  [ActivityType.QUIZ]: "Quiz",
  [ActivityType.THEMED_PASSWORD]: "Senha criativa",
  [ActivityType.DECISION_MAZE]: "Labirinto de decisões",
  [ActivityType.FAKE_CHAT]: "Chat falso",
  [ActivityType.MATCH_PAIRS]: "Pares iguais",
  [ActivityType.INFORMATIVE_TEXT]: "Texto informativo",
};
