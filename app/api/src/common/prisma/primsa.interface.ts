export const prismaClientErrorCodes = {
  P2002: {
    type: 'UNIQ_CONSTRAINT',
    isOk: true,
    message: 'username already exists',
  },
} as const;

export type PrismaClientErrorCodes = keyof typeof prismaClientErrorCodes;
