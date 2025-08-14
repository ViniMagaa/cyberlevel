import { AgeGroup } from "@prisma/client";

export const ageGroup: Record<AgeGroup, string> = {
  [AgeGroup.CHILD]: "Crianças",
  [AgeGroup.TEEN]: "Adolescentes",
};
