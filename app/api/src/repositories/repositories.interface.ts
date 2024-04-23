import { users } from '@prisma/client';

export type Options = {
  queryOptions?: {
    orderBy: Record<string, unknown>;
  };
};

const userProtectedFields = {
  password: 'password',
} as const;

export const protectedFields = Object.values(userProtectedFields);
export type UserProtectedFields =
  (typeof userProtectedFields)[keyof typeof userProtectedFields];

export type PublicUsersData = Omit<users, UserProtectedFields>;
