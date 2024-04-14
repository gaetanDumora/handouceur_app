export type Options = {
  queryOptions?: {
    orderBy: Record<string, unknown>;
  };
};

const userProtectedFields = {
  password: 'hashedPassword',
  salt: 'salt',
} as const;

export const protectedFields = Object.values(userProtectedFields);
export type UserProtectedFields =
  (typeof userProtectedFields)[keyof typeof userProtectedFields];
