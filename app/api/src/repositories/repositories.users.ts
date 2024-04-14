import { Injectable } from '@nestjs/common';
import { PrismaClient, users } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { Repository } from './repositories.base';
import {
  Options,
  UserProtectedFields,
  protectedFields,
} from './repositories.interface';

@Injectable()
export class UsersRepo extends Repository {
  constructor(
    protected prismaService: PrismaService,
    protected prismaInstance: PrismaClient,
  ) {
    super(prismaService, prismaInstance);
  }

  async listAll(
    options?: Options,
  ): Promise<Omit<users, UserProtectedFields>[]> {
    const queryOptions = options?.queryOptions ?? {
      orderBy: {
        [this.DEFAULT_ORDERING_KEY]: this.DEFAULT_ORDERING,
      },
    };

    const query = this.prismaInstance.users.findMany(queryOptions);
    // Try to execute query with the actual PrismaClient, if the query fails, instantiate a new PrismaClient
    const response = await this.tryQuery<users[]>(query);
    if (!response?.length) {
      return this.listAll(options);
    }
    return response.map((user) =>
      this.exclude<users, UserProtectedFields>(user, protectedFields),
    );
  }
}
// try {
//   const list = await prisma.users.findMany(queryOptions);
//   return list.map((user) =>
//     this.exclude<users, 'hashedPassword' | 'salt'>(user, [
//       'hashedPassword',
//       'salt',
//     ]),
//   );
// } catch (error) {
//   if (this.isPrismaError(error) && this.MAX_RETRY_CONNECTION > 0) {
//     this.MAX_RETRY_CONNECTION--;
//     return this.listAll({ newInstance: true });
//   } else {
//     throw error;
//   }
// }
