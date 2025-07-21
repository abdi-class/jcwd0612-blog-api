import { PrismaClient } from "../../prisma/generated/client";

export const prisma = new PrismaClient({
  log: ["error", "warn", "query", "info"],
});
