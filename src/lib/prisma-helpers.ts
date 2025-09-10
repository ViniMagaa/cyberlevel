import { Prisma } from "@prisma/client";

// Converte todos os Prisma.Decimal de um objeto ou array para number
export function decimalToNumber<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => decimalToNumber(item)) as unknown as T;
  }

  if (obj instanceof Date) {
    // não altera Date
    return obj;
  }

  if (obj && typeof obj === "object") {
    const newObj: Record<string, unknown> = {};

    for (const key in obj) {
      const value = (obj as Record<string, unknown>)[key];

      if (value instanceof Prisma.Decimal) {
        newObj[key] = value.toNumber();
      } else if (value instanceof Date) {
        newObj[key] = value; // mantém Date
      } else if (typeof value === "object" && value !== null) {
        newObj[key] = decimalToNumber(value);
      } else {
        newObj[key] = value;
      }
    }

    return newObj as T;
  }

  return obj;
}
