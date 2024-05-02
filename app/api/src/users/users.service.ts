import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepo } from '../common/repositories/repositories.users';
import { UserBaseDTO } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private userRepo: UsersRepo) {}

  async findAll() {
    return await this.userRepo.listAll();
  }

  async findOne(identifier: string) {
    return await this.userRepo.findOne(identifier);
  }

  async insertOne(user: UserBaseDTO) {
    return await this.userRepo.create(user);
  }

  async getProfile(identifier: string) {
    const user = await this.findOne(identifier);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
