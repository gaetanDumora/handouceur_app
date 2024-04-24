export const prismaClientErrorCodes = {
  P2002: {
    type: 'UNIQ_CONSTRAINT',
    panic: true,
    message: 'username already exists',
  },
} as const;

export type PrismaClientErrorCodes = keyof typeof prismaClientErrorCodes;
export type PrismaClientErrors = {
  type: string;
  panic: boolean;
  message: string;
};
