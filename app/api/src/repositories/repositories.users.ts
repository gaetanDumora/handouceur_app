import { Injectable } from '@nestjs/common';
import { users } from '@prisma/client';
import {
  Options,
  PublicUsersData,
  UserProtectedFields,
  protectedFields,
} from './repositories.interface';
import { RepositoriesService } from './repositories.service';
import { CreateUserInput } from '../users/users.interface';

@Injectable()
export class UsersRepo {
  constructor(protected readonly repo: RepositoriesService) {}

  async listAll(options?: Options): Promise<PublicUsersData[] | undefined> {
    const queryOptions = options?.queryOptions ?? {
      orderBy: {
        [this.repo.DEFAULT_ORDERING_KEY]: this.repo.DEFAULT_ORDERING,
      },
    };

    const query = this.repo.prisma.users.findMany(queryOptions);
    // Try to execute query with the actual PrismaClient, if the query fails, instantiate a new PrismaClient
    const { retry, data } = await this.repo.runQuery(query);
    if (retry) {
      return this.listAll(options);
    }

    if (data?.length) {
      return data.map((user) =>
        this.repo.exclude<users, UserProtectedFields>(user, protectedFields),
      );
    }
  }

  async findOne(
    identifier: string,
    exclude = true,
  ): Promise<null | users | PublicUsersData> {
    const query = this.repo.prisma.users.findFirst({
      where: {
        OR: [
          { emailAddress: { equals: identifier } },
          { username: { equals: identifier } },
        ],
      },
    });
    const { retry, data } = await this.repo.runQuery<users | null>(query);
    if (retry) {
      return this.findOne(identifier);
    }

    if (!exclude && data) {
      return data;
    }
    if (!data) {
      return null;
    }
    return this.repo.exclude<users, UserProtectedFields>(data, protectedFields);
  }

  async create(createUser: CreateUserInput) {
    const user = await this.repo.prisma.users.create({
      data: { ...createUser },
    });

    return user.userId;
  }
}
