import { PrismaClient } from "@prisma/client";
import { usePgRole } from ".";

let prismaInstanceReadOnly: PrismaClient;
let prismaInstance: PrismaClient;

export const prismaReadOnly = async () => {
  if (prismaInstanceReadOnly) {
    return prismaInstanceReadOnly;
  }

  const { password, username } = await usePgRole("ro");
  prismaInstanceReadOnly = new PrismaClient({
    datasources: {
      db: {
        url: `postgresql://${username}:${password}@localhost/handouceur?sslmode=require&connection_limit=5`,
      },
    },
  });
  return prismaInstanceReadOnly;
};

export const prisma = async () => {
  if (prismaInstance) {
    return prismaInstance;
  }

  const { password, username } = await usePgRole("rwd");
  prismaInstance = new PrismaClient({
    datasources: {
      db: {
        url: `postgresql://${username}:${password}@localhost/handouceur?sslmode=require&connection_limit=5`,
      },
    },
  });
  return prismaInstance;
};
