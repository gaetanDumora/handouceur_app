import { Injectable } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import {
  createUserInput,
  User,
  USER_PERMISSIONS,
  USER_ROLES,
} from '../users/users.interface';

const DEFAULT_ROLE_ID = { [USER_ROLES.USER]: 3 };
const DEFAULT_PERMISSION_ID = { [USER_PERMISSIONS.RWD]: 1 };
type Options = {
  queryOptions?: {
    orderBy: Record<string, unknown>;
  };
};

@Injectable()
export class UsersRepo {
  private readonly DEFAULT_JOIN = {
    include: {
      userRolesPermissions: {
        select: {
          roles: { select: { roleName: true } },
          permissions: { select: { permissionName: true } },
        },
      },
    },
  };
  constructor(protected readonly repo: RepositoriesService) {}

  async listAll(options?: Options): Promise<User[] | null> {
    const queryOptions = options?.queryOptions ?? {
      orderBy: {
        [this.repo.DEFAULT_ORDERING_KEY]: this.repo.DEFAULT_ORDERING,
      },
    };

    const query = this.repo.prisma.users.findMany({
      ...queryOptions,
      ...this.DEFAULT_JOIN,
    });
    const { retry, data } = await this.repo.runQuery(query);
    if (retry) {
      this.listAll(options);
    }

    if (!data?.length) {
      return null;
    }
    //@ts-expect-error roleName and permissionName types are missing in Prisma schema
    return data.map((user) =>
      this.repo.exclude<(typeof data)[number], 'password'>(user, ['password']),
    );
  }

  async findOne(
    identifier: string,
  ): Promise<(User & { password: string }) | null> {
    const query = this.repo.prisma.users.findFirst({
      where: {
        OR: [
          { emailAddress: { equals: identifier } },
          { username: { equals: identifier } },
        ],
      },
      ...this.DEFAULT_JOIN,
    });

    const { retry, data } = await this.repo.runQuery(query);
    if (retry) {
      return this.findOne(identifier);
    }
    //@ts-expect-error roleName and permissionName types are missing in Prisma schema
    return data;
  }

  async create(createUser: createUserInput): Promise<User | null> {
    const query = this.repo.prisma.users.create({
      data: {
        ...createUser,
        userRolesPermissions: {
          create: {
            roleId: DEFAULT_ROLE_ID[USER_ROLES.USER],
            permissionId: DEFAULT_PERMISSION_ID[USER_PERMISSIONS.RWD],
          },
        },
      },
      ...this.DEFAULT_JOIN,
    });

    const { retry, data } = await this.repo.runQuery(query);
    if (retry) {
      return this.create(createUser);
    }

    delete (data as any).password;
    //@ts-expect-error roleName and permissionName types are missing in Prisma schema
    return data;
  }
}
