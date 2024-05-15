export const UNIQ_CONSTRAINT = 'UNIQ_CONSTRAINT';
export const INCORRECT_CREDENTIALS = 'INCORRECT_CREDENTIALS';
export const PRISMA_ERRORS = {
  P2002: UNIQ_CONSTRAINT,
} as const;
export type PrismaCodeErrors = keyof typeof PRISMA_ERRORS;
