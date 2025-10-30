import { isValid, parse } from "date-fns";

export function formatDate(
  date: Date,
  locale: string = "pt-BR",
  timeZone: string = "UTC",
): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone,
  }).format(date);
}

export function parseBirthdate(value: string) {
  const parsed = parse(value, "dd/MM/yyyy", new Date());
  return isValid(parsed) ? parsed : null;
}
