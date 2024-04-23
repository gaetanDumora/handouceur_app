import { Injectable } from '@nestjs/common';
import { UsersRepo } from '../repositories/repositories.users';
import {
  prismaClientErrorCodes,
  PrismaClientErrorCodes,
} from '../common/prisma/primsa.interface';
import { users } from '@prisma/client';
import { PublicUsersData } from '../repositories/repositories.interface';
import { CreateUserInput } from './users.interface';

@Injectable()
export class UsersService {
  constructor(private userRepo: UsersRepo) {}

  async findAll() {
    return await this.userRepo.listAll();
  }

  async findOnePublic(identifier: string) {
    const user: PublicUsersData | null =
      await this.userRepo.findOne(identifier);
    return user;
  }

  async findOnePrivate(identifier: string) {
    const user = (await this.userRepo.findOne(
      identifier,
      false,
    )) as users | null;
    return user;
  }

  async insertOne(user: CreateUserInput) {
    try {
      return await this.userRepo.create(user);
    } catch (error) {
      const prismaError =
        prismaClientErrorCodes[error?.code as PrismaClientErrorCodes];
      if (!prismaError) {
        throw error;
      }

      return prismaError;
    }
  }
}
