import { Injectable, OnModuleInit } from '@nestjs/common';
import { USER_PERMISSIONS, USER_ROLES } from '../../users/users.interface';
import {
  DefaultArgs,
  PrismaClientInitializationError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserBaseDTO, UserDTO } from 'src/users/users.dto';

const DEFAULT_ROLE_ID = { [USER_ROLES.USER]: 3 };
const DEFAULT_PERMISSION_ID = { [USER_PERMISSIONS.RWD]: 1 };

@Injectable()
export class UsersRepo implements OnModuleInit {
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

  private repo: Prisma.usersDelegate<DefaultArgs>;
  constructor(protected readonly prismaService: PrismaService) {}
  async onModuleInit() {
    const prismaInstance = await this.prismaService.getPrismaInstance();
    this.repo = prismaInstance.users;
  }
  async listAll(): Promise<UserDTO[] | undefined> {
    try {
      //@ts-expect-error roleName and permissionName types are missing in Prisma schema
      return await this.repo.findMany({
        ...this.DEFAULT_JOIN,
      });
    } catch (error) {
      return this.handleError(error, this.listAll.bind(this));
    }
  }

  async findOne(identifier: string | number): Promise<UserDTO | null> {
    try {
      const where =
        typeof identifier === 'string'
          ? {
              OR: [
                { emailAddress: { equals: identifier } },
                { username: { equals: identifier } },
              ],
            }
          : { userId: { equals: identifier } };

      const user = await this.repo.findFirst({
        where,
        ...this.DEFAULT_JOIN,
      });
      //@ts-expect-error roleName and permissionName types are missing in Prisma schema
      return user;
    } catch (error) {
      return this.handleError(error, this.findOne.bind(this), identifier);
    }
  }

  async create(userBase: UserBaseDTO): Promise<UserDTO> {
    try {
      //@ts-expect-error roleName and permissionName types are missing in Prisma schema
      return await this.repo.create({
        data: {
          ...userBase,
          userRolesPermissions: {
            create: {
              roleId: DEFAULT_ROLE_ID[USER_ROLES.USER],
              permissionId: DEFAULT_PERMISSION_ID[USER_PERMISSIONS.RWD],
            },
          },
        },
        ...this.DEFAULT_JOIN,
      });
    } catch (error) {
      return this.handleError(error, this.create.bind(this), userBase);
    }
  }

  async findById(userId: number) {
    try {
      return await this.repo.findFirstOrThrow({ where: { userId } });
    } catch (error) {
      this.handleError(error, this.findById.bind(this), userId);
    }
  }

  private async handleError<T>(
    error: Error,
    callback: (...args: unknown[]) => T,
    ...args: unknown[]
  ) {
    if (
      !(error instanceof PrismaClientInitializationError) &&
      !(error instanceof PrismaClientUnknownRequestError)
    ) {
      throw error;
    }
    const newPrismaInstance = await this.prismaService.getPrismaInstance(true);
    this.repo = newPrismaInstance.users;
    return callback(...args);
  }
}
