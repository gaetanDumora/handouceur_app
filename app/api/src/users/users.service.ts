import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepo } from '../repositories/repositories.users';
import { createUserInput, User } from './users.interface';

@Injectable()
export class UsersService {
  constructor(private userRepo: UsersRepo) {}

  async findAll() {
    return await this.userRepo.listAll();
  }

  async findOne(identifier: string) {
    return await this.userRepo.findOne(identifier);
  }

  async insertOne(user: createUserInput) {
    return await this.userRepo.create(user);
  }

  async getProfile(identifier: string) {
    const user = await this.findOne(identifier);
    if (!user) {
      throw new NotFoundException();
    }

    delete user.userId;
    delete (user as Partial<typeof user>).userRolesPermissions;
    delete (user as Partial<typeof user>).password;

    return user as Omit<User, 'userId' | 'password' | 'userRolesPermissions'>;
  }
}
