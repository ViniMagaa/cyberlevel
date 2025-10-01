const BASE_XP = 100;
const MIN_XP = 10;

export function calculateXP(startedAt: Date, completedAt: Date) {
  const timeTaken = (completedAt.getTime() - startedAt.getTime()) / 1000;
  let xp = BASE_XP;
  if (timeTaken > 30) {
    xp -= Math.floor(timeTaken - 30);
  }
  return Math.max(xp, MIN_XP);
}
