import { PrismaClient } from "@prisma/client";
import { usePgRole } from "../vault/vault-client";

let prismaReadInstance: PrismaClient;
let prismaReadWriteDeleteInstance: PrismaClient;

export const prismaRO = async () => {
  if (prismaReadInstance) {
    return prismaReadInstance;
  }

  const { password, username } = await usePgRole("ro");
  prismaReadInstance = new PrismaClient({
    datasources: {
      db: {
        url: `postgresql://${username}:${password}@localhost/handouceur?sslmode=require&connection_limit=5`,
      },
    },
  });
  return prismaReadInstance;
};

export const prismaRWD = async () => {
  if (prismaReadWriteDeleteInstance) {
    return prismaReadWriteDeleteInstance;
  }

  const { password, username } = await usePgRole("rwd");
  prismaReadWriteDeleteInstance = new PrismaClient({
    datasources: {
      db: {
        url: `postgresql://${username}:${password}@localhost/handouceur?sslmode=require&connection_limit=5`,
      },
    },
  });
  return prismaReadWriteDeleteInstance;
};
