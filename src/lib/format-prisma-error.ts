import { Prisma } from "@prisma/client";

export function formatPrismaError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return `Prisma error: ${error.code} — ${error.message}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
